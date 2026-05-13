import { TABLES } from "@/lib/constants/tables";
import { createClient } from "@/utils/supabase";
import { getProposalBioflocProvinceSummary } from "./proposal-biofloc-services";

export type ProgramQuotaRow = {
  id: number;
  province_code: string;
  province_name: string;
  program_type: string;
  year: number;
  quota_limit: number;
  created_at: string;
  updated_at: string;
};

export type ProgramQuotaViewRow = {
  id: number | null;
  province_code: string;
  region_name: string;
  program_type: string;
  year: number;
  quota_limit: number;
  proposal_count: number;
  updated_at: string | null;
};

type ProgramQuotaResult = {
  data: ProgramQuotaViewRow[];
  proposal_total: number;
};

export async function getProgramQuotasByTypeAndYear(
  programType: string,
  year: number,
) {
  const supabase = await createClient();
  const [quotaResult, proposalSummary] = await Promise.all([
    supabase
      .from(TABLES.PROGRAM_QUOTAS)
      .select("id, province_code, province_name, quota_limit")
      .eq("program_type", programType)
      .eq("year", year)
      .order("province_code", { ascending: true }),
    getProposalBioflocProvinceSummary(supabase, programType),
  ]);

  const { data, error } = quotaResult;

  if (error) {
    throw error;
  }

  return {
    data: mapProgramQuotaRows({
      programType,
      year,
      rows: (data ?? []) as ProgramQuotaRow[],
      proposalCountByProvince: proposalSummary.proposal_count_by_province,
    }),
    proposal_total: proposalSummary.proposal_total,
  } satisfies ProgramQuotaResult;
}

export async function getProgramQuotasByTypeAndYearWithMinQuota(
  programType: string,
  year: number,
  minQuota: number,
) {
  const supabase = await createClient();
  const [quotaResult, proposalSummary] = await Promise.all([
    supabase
      .from(TABLES.PROGRAM_QUOTAS)
      .select("id, province_code, province_name, quota_limit")
      .eq("program_type", programType)
      .eq("year", year)
      .gt("quota_limit", minQuota)
      .order("province_code", { ascending: true }),
    getProposalBioflocProvinceSummary(supabase, programType),
  ]);
  const { data, error } = quotaResult;

  if (error) {
    throw error;
  }

  return {
    data: mapProgramQuotaRows({
      programType,
      year,
      rows: (data ?? []) as ProgramQuotaRow[],
      proposalCountByProvince: proposalSummary.proposal_count_by_province,
    }),
    proposal_total: proposalSummary.proposal_total,
  } satisfies ProgramQuotaResult;
}

export async function upsertProgramQuotaByProvince(input: {
  province_code: string;
  province_name: string;
  program_type: string;
  year: number;
  quota_limit: number;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.PROGRAM_QUOTAS)
    .upsert(
      {
        province_code: input.province_code,
        province_name: input.province_name,
        program_type: input.program_type,
        year: input.year,
        quota_limit: input.quota_limit,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "province_code,program_type,year",
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
  programType: string;
  year: number;
  rows: ProgramQuotaRow[];
  proposalCountByProvince: Record<string, number>;
}): ProgramQuotaViewRow[] {
  return input.rows.map((row) => {
    const normalizedProvinceName = row.province_name.trim().toLowerCase();
    return {
      id: row.id ?? null,
      province_code: row.province_code,
      region_name: row.province_name,
      program_type: input.programType,
      year: input.year,
      quota_limit: row.quota_limit,
      proposal_count:
        input.proposalCountByProvince[normalizedProvinceName] ?? 0,
      updated_at: row.updated_at ?? null,
    };
  });
}
