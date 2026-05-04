import { createClient } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import { uuidv7 } from "uuidv7";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { phase, images } = body as {
    phase: number;
    images: { file_path: string; file_name: string }[];
  };

  if (!phase || !images || images.length === 0) {
    return NextResponse.json(
      { error: "Phase dan images harus diisi." },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // 1. Hapus dokumentasi lama untuk fase ini agar ter-replace
  const { error: deleteError } = await supabase
    .from("isf_recruitment_documentations")
    .delete()
    .eq("phase", phase);

  if (deleteError) {
    console.error("Error deleting old documentation:", deleteError);
    return NextResponse.json(
      { error: `Gagal memperbarui data lama: ${deleteError.message}` },
      { status: 500 },
    );
  }

  // 2. Insert dokumentasi yang baru
  const rows = images.map((img) => ({
    id: uuidv7(),
    phase,
    file_path: img.file_path,
    file_name: img.file_name,
  }));

  const { error } = await supabase
    .from("isf_recruitment_documentations")
    .insert(rows);

  if (error) {
    console.error("Supabase Error detail:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    return NextResponse.json(
      { error: `Gagal menyimpan: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
