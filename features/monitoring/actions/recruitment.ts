"use server";

import { createClient } from "@/utils/supabase";

export type RecruitmentDocumentation = {
  id: string;
  phase: number;
  file_path: string;
  file_name: string;
  created_at: string;
  updated_at: string;
};

/**
 * Fetches documentation images for a specific recruitment phase.
 * @param phase 1: Sosialisasi, 2: Seleksi, 3: Pelatihan, 4: Penempatan
 */
export async function getRecruitmentDocumentations(
  phase: number,
): Promise<RecruitmentDocumentation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("isf_recruitment_documentations")
    .select("*")
    .eq("phase", phase);

  if (error) {
    console.error("Error fetching recruitment documentations:", error);
    return [];
  }

  return data || [];
}
