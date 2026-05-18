"use server";

import * as db from "../services/isf-program-services";

export async function upsertIsfRecruitmentDocumentations(
  phase: number,
  images: { file_path: string; file_name: string }[],
): Promise<{ success: boolean; error?: string }> {
  if (!phase || !images || images.length === 0) {
    return {
      success: false,
      error: "Phase dan images harus diisi.",
    };
  }

  try {
    await db.upsertIsfRecruitmentDocumentationsService(phase, images);
    return { success: true };
  } catch (error) {
    console.error(
      "Error inside upsertIsfRecruitmentDocumentations Server Action:",
      error,
    );
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan internal saat menyimpan dokumentasi",
    };
  }
}
