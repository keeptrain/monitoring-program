import { TABLES } from "@/lib/constants/tables";
import { createClient } from "@/utils/supabase";
import { PROGRAM_QUOTA_TYPE } from "../forms/program-quota-schema";

export type ProgramQuotaRow = {
  id: number;
  region_id: string;
  program_type: string;
  year: number;
  quota_limit: number;
  created_at: string;
  updated_at: string;
};

export async function getProgramQuotasByTypeAndYearService(year: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.PROGRAM_QUOTAS)
    .select("*")
    .eq("program_type", PROGRAM_QUOTA_TYPE)
    .eq("year", year)
    .order("region_id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as ProgramQuotaRow[];
}

export async function upsertProgramQuotaByRegionService(input: {
  region_id: string;
  year: number;
  quota_limit: number;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.PROGRAM_QUOTAS)
    .upsert(
      {
        region_id: input.region_id,
        program_type: PROGRAM_QUOTA_TYPE,
        year: input.year,
        quota_limit: input.quota_limit,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "region_id,program_type,year",
      },
    )
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as ProgramQuotaRow;
}
