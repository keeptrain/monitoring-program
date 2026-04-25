"use server";

import { revalidatePath } from "next/cache";
import { INDONESIA_PROVINCES } from "../constants/indonesia-provinces";
import {
  PROGRAM_QUOTA_YEAR,
  programQuotaUpdateSchema,
} from "../forms/program-quota-schema";
import * as db from "../services/program-quota-services";
import type { ProgramQuotaViewRow } from "../services/program-quota-services";

export type ProgramQuotaView = ProgramQuotaViewRow;

export async function getBioflocProgramQuotas(): Promise<{
  data: ProgramQuotaView[];
  proposal_total: number;
}> {
  const existing = await db.getProgramQuotasByTypeAndYear(PROGRAM_QUOTA_YEAR);
  return {
    data: existing.data,
    proposal_total: existing.proposal_total,
  };
}

export async function getBioflocProgramQuotasPublic(): Promise<{
  data: ProgramQuotaView[];
  proposal_total: number;
}> {
  const existing = await db.getProgramQuotasByTypeAndYearWithMinQuota(
    PROGRAM_QUOTA_YEAR,
    0,
  );

  return {
    data: existing.data,
    proposal_total: existing.proposal_total,
  };
}

export async function upsertBioflocProgramQuota(input: {
  region_id: string;
  quota_limit: number;
}) {
  const parsed = programQuotaUpdateSchema.parse({
    quota_limit: input.quota_limit,
  });

  const province = INDONESIA_PROVINCES.find(
    (item) => item.region_id === input.region_id,
  );
  if (!province) {
    throw new Error("Region tidak valid.");
  }

  const row = await db.upsertProgramQuotaByRegion({
    region_id: input.region_id,
    year: PROGRAM_QUOTA_YEAR,
    quota_limit: parsed.quota_limit,
  });

  revalidatePath("/dashboard/thematic/biofloc");

  return {
    id: row.id,
    region_id: row.region_id,
    region_name: province.name,
    program_type: "biofloc_thematic" as const,
    year: row.year,
    quota_limit: row.quota_limit,
    proposal_count: 0,
    updated_at: row.updated_at,
  } satisfies ProgramQuotaView;
}
