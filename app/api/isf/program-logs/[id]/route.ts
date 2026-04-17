import { createClient } from "@/utils/supabase";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const reportId = Number(id);
  const url = new URL(request.url);
  const stepId = Number(url.searchParams.get("stepId"));

  if (Number.isNaN(reportId) || Number.isNaN(stepId)) {
    return NextResponse.json({ message: "Invalid id or stepId" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("isf_program_logs").delete().eq("id", reportId);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  revalidatePath("/dashboard/isf");
  revalidatePath(`/dashboard/isf/${stepId}`);

  return NextResponse.json({ success: true });
}

