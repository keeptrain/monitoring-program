import { TABLES } from "@/lib/constants/tables";
import { createClient } from "@/utils/supabase";
import { uuidv7 } from "uuidv7";

export async function upsertIsfRecruitmentDocumentationsService(
  phase: number,
  images: { file_path: string; file_name: string }[],
): Promise<void> {
  const supabase = await createClient();

  // 1. Hapus dokumentasi lama untuk fase ini agar ter-replace
  const { error: deleteError } = await supabase
    .from(TABLES.ISF_RECRUITMENT_DOCUMENTATIONS)
    .delete()
    .eq("phase", phase);

  if (deleteError) {
    // Log the detailed database/query error internally on the server
    console.error(
      "Error deleting old ISF recruitment documentation:",
      deleteError,
    );

    // Throw a generic, standardized English error message to the client
    throw new Error("Failed to clear previous documentation records.");
  }

  // 2. Insert dokumentasi yang baru
  const rows = images.map((img) => ({
    id: uuidv7(),
    phase,
    file_path: img.file_path,
    file_name: img.file_name,
  }));

  const { error: insertError } = await supabase
    .from(TABLES.ISF_RECRUITMENT_DOCUMENTATIONS)
    .insert(rows);

  if (insertError) {
    // Log the detailed database/query error internally on the server
    console.error("Supabase error inserting ISF recruitment documentation:", {
      code: insertError.code,
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
    });

    // Throw a generic, standardized English error message to the client
    throw new Error("Failed to save new recruitment documentation.");
  }
}
