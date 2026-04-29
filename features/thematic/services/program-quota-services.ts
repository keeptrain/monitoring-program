import { TABLES } from "@/lib/constants/tables";
import { createClient } from "@/utils/supabase";
import { INDONESIA_PROVINCES } from "../constants/indonesia-provinces";
import { PROGRAM_QUOTA_TYPE } from "../forms/program-quota-schema";
import { getProposalBioflocProvinceSummary } from "./proposal-biofloc-services";

export type ProgramQuotaRow = {
  id: number;
  province_id: string;
  program_type: string;
  year: number;
  quota_limit: number;
  created_at: string;
  updated_at: string;
};

export type ProgramQuotaViewRow = {
  id: number | null;
  province_id: string;
  region_name: string;
  program_type: "biofloc_thematic";
  year: number;
  quota_limit: number;
  proposal_count: number;
  updated_at: string | null;
};

type ProgramQuotaResult = {
  data: ProgramQuotaViewRow[];
  proposal_total: number;
};

export async function getProgramQuotasByTypeAndYear(year: number) {
  const supabase = await createClient();
  const [quotaResult, proposalSummary] = await Promise.all([
    supabase
      .from(TABLES.PROGRAM_QUOTAS)
      .select("id, province_id, quota_limit")
      .eq("program_type", PROGRAM_QUOTA_TYPE)
      .eq("year", year)
      .order("province_id", { ascending: true }),
    getProposalBioflocProvinceSummary(supabase),
  ]);
  const { data, error } = quotaResult;

  if (error) {
    throw error;
  }

  return {
    data: mapProgramQuotaRows({
      year,
      rows: (data ?? []) as ProgramQuotaRow[],
      proposalCountByProvince: proposalSummary.proposal_count_by_province,
      onlyPositiveQuota: false,
    }),
    proposal_total: proposalSummary.proposal_total,
  } satisfies ProgramQuotaResult;
}

export async function getProgramQuotasByTypeAndYearWithMinQuota(
  year: number,
  minQuota: number,
) {
  const supabase = await createClient();
  const [quotaResult, proposalSummary] = await Promise.all([
    supabase
      .from(TABLES.PROGRAM_QUOTAS)
      .select("id, province_id, quota_limit")
      .eq("program_type", PROGRAM_QUOTA_TYPE)
      .eq("year", year)
      .gt("quota_limit", minQuota)
      .order("province_id", { ascending: true }),
    getProposalBioflocProvinceSummary(supabase),
  ]);
  const { data, error } = quotaResult;

  if (error) {
    throw error;
  }

  return {
    data: mapProgramQuotaRows({
      year,
      rows: (data ?? []) as ProgramQuotaRow[],
      proposalCountByProvince: proposalSummary.proposal_count_by_province,
      onlyPositiveQuota: minQuota >= 0,
    }),
    proposal_total: proposalSummary.proposal_total,
  } satisfies ProgramQuotaResult;
}

export async function upsertProgramQuotaByProvince(input: {
  province_id: string;
  year: number;
  quota_limit: number;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.PROGRAM_QUOTAS)
    .upsert(
      {
        province_id: input.province_id,
        program_type: PROGRAM_QUOTA_TYPE,
        year: input.year,
        quota_limit: input.quota_limit,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "province_id,program_type,year",
      },
    )
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as ProgramQuotaRow;
}

function mapProgramQuotaRows(input: {
  year: number;
  rows: ProgramQuotaRow[];
  proposalCountByProvince: Record<string, number>;
  onlyPositiveQuota: boolean;
}): ProgramQuotaViewRow[] {
  if (input.onlyPositiveQuota) {
    const provinceByProvinceId = new Map(
      INDONESIA_PROVINCES.map((province) => [province.province_id, province]),
    );

    return input.rows.map((row) => {
      const province = provinceByProvinceId.get(row.province_id);
      const region_name = province?.name ?? row.province_id;
      const normalizedProvinceName = region_name.trim().toLowerCase();
      return {
        id: row.id ?? null,
        province_id: row.province_id,
        region_name,
        program_type: "biofloc_thematic",
        year: input.year,
        quota_limit: row.quota_limit,
        proposal_count:
          input.proposalCountByProvince[normalizedProvinceName] ?? 0,
        updated_at: row.updated_at ?? null,
      };
    });
  }

  const byProvince = new Map(input.rows.map((row) => [row.province_id, row]));
  return INDONESIA_PROVINCES.map((province) => {
    const row = byProvince.get(province.province_id);
    const normalizedProvinceName = province.name.trim().toLowerCase();
    return {
      id: row?.id ?? null,
      province_id: province.province_id,
      region_name: province.name,
      program_type: "biofloc_thematic",
      year: input.year,
      quota_limit: row?.quota_limit ?? 0,
      proposal_count:
        input.proposalCountByProvince[normalizedProvinceName] ?? 0,
      updated_at: row?.updated_at ?? null,
    };
  });
}
