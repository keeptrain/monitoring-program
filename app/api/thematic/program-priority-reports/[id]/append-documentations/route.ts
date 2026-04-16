import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase";

type DocumentationInput = {
  image_before_path: string;
  image_after_path: string;
};

type DocumentationRecord = DocumentationInput & {
  id: string;
  created_at: string;
  updated_at: string;
};

type ReportRow = {
  documentations: unknown;
};

function normalizeDocumentations(
  docs: DocumentationInput[],
): DocumentationRecord[] {
  const now = new Date().toISOString();
  return docs.map((doc) => ({
    id: crypto.randomUUID(),
    image_before_path: doc.image_before_path,
    image_after_path: doc.image_after_path,
    created_at: now,
    updated_at: now,
  }));
}

function isDocumentationInput(value: unknown): value is DocumentationInput {
  if (typeof value !== "object" || value === null) return false;
  const doc = value as Record<string, unknown>;
  return (
    typeof doc.image_before_path === "string" &&
    doc.image_before_path.length > 0 &&
    typeof doc.image_after_path === "string" &&
    doc.image_after_path.length > 0
  );
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const reportId = Number(id);
  if (Number.isNaN(reportId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as {
    percentage_of_work?: unknown;
    documentations?: unknown;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const percentage =
    typeof body.percentage_of_work === "number" ? body.percentage_of_work : null;
  if (percentage !== null && (percentage < 0 || percentage > 100)) {
    return NextResponse.json({ error: "Invalid percentage" }, { status: 400 });
  }

  const docInputs = Array.isArray(body.documentations)
    ? body.documentations.filter(isDocumentationInput)
    : [];

  const supabase = await createClient();
  const { data: existing, error: fetchError } = await supabase
    .from("program_priority_reports")
    .select("documentations")
    .eq("id", reportId)
    .single<ReportRow>();

  if (fetchError) {
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 },
    );
  }

  const existingDocs = Array.isArray(existing?.documentations)
    ? (existing.documentations as DocumentationRecord[])
    : [];
  const appendedDocs = normalizeDocumentations(docInputs);

  const payload: {
    documentations: DocumentationRecord[];
    updated_at: string;
    percentage_of_work?: number;
  } = {
    documentations: [...existingDocs, ...appendedDocs],
    updated_at: new Date().toISOString(),
  };

  if (percentage !== null) {
    payload.percentage_of_work = percentage;
  }

  const { error: updateError } = await supabase
    .from("program_priority_reports")
    .update(payload)
    .eq("id", reportId);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
