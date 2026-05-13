"use server";

import { revalidatePath } from "next/cache";
import {
  PROGRAM_QUOTA_YEAR,
  programQuotaUpdateSchema,
} from "../forms/program-quota-schema";
import * as db from "../services/program-quota-services";
import type { ProgramQuotaViewRow } from "../services/program-quota-services";
import { ThematicType } from "../constants/filter-state";

export type ProgramQuotaView = ProgramQuotaViewRow;

export async function getBioflocProgramQuotas(
  programType: ThematicType,
): Promise<{
  data: ProgramQuotaView[];
  proposal_total: number;
}> {
  const existing = await db.getProgramQuotasByTypeAndYear(
    programType,
    PROGRAM_QUOTA_YEAR,
  );
  return {
    data: existing.data,
    proposal_total: existing.proposal_total,
  };
}

export async function getBioflocProgramQuotasPublic(
  programType: ThematicType,
): Promise<{
  data: ProgramQuotaView[];
  proposal_total: number;
}> {
  const existing = await db.getProgramQuotasByTypeAndYearWithMinQuota(
    programType,
    PROGRAM_QUOTA_YEAR,
    0,
  );

  return {
    data: existing.data,
    proposal_total: existing.proposal_total,
  };
}

export async function upsertBioflocProgramQuota(input: {
  program_type: string;
  province_code: string;
  province_name: string;
  quota_limit: number;
}) {
  const parsed = programQuotaUpdateSchema.parse({
    quota_limit: input.quota_limit,
  });

  const row = await db.upsertProgramQuotaByProvince({
    province_code: input.province_code,
    province_name: input.province_name,
    program_type: input.program_type,
    year: PROGRAM_QUOTA_YEAR,
    quota_limit: parsed.quota_limit,
  });

  revalidatePath("/dashboard/thematic/biofloc");
  revalidatePath("/dashboard/thematic/minapadi");

  return {
    id: row.id,
    province_code: row.province_code,
    region_name: row.province_name,
    program_type: input.program_type,
    year: row.year,
    quota_limit: row.quota_limit,
    proposal_count: 0,
    updated_at: row.updated_at,
  } satisfies ProgramQuotaView;
}
