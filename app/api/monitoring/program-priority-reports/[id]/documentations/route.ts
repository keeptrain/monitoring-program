import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

type Documentation = {
  id: string;
  image_before_path: string | null;
  image_after_path: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const reportId = Number(id);
  const offsetParam = Number(request.nextUrl.searchParams.get("offset") ?? 0);
  const limitParam = Number(request.nextUrl.searchParams.get("limit") ?? 5);
  const offset = Number.isNaN(offsetParam) ? 0 : Math.max(offsetParam, 0);
  const limit = Number.isNaN(limitParam)
    ? 5
    : Math.min(Math.max(limitParam, 1), 20);

  if (!Number.isFinite(reportId)) {
    return NextResponse.json(
      { error: "Invalid report id" },
      {
        status: 400,
      }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Supabase configuration is missing" },
      {
        status: 500,
      }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase
    .from("program_priority_reports")
    .select("documentations")
    .eq("id", reportId)
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch documentation" },
      {
        status: 500,
      }
    );
  }

  const rawDocumentations = Array.isArray(data?.documentations)
    ? data.documentations
    : [];

  const documentations = rawDocumentations.map((documentation, index) => {
    const item = documentation as Partial<Documentation>;

    return {
      id: item.id ?? String(index),
      image_before_path: item.image_before_path ?? null,
      image_after_path: item.image_after_path ?? null,
      created_at: item.created_at ?? null,
      updated_at: item.updated_at ?? null,
    };
  });

  const pagedDocumentations = documentations.slice(offset, offset + limit);
  const hasMore = offset + pagedDocumentations.length < documentations.length;

  return NextResponse.json({
    offset,
    limit,
    total: documentations.length,
    has_more: hasMore,
    documentations: pagedDocumentations,
  });
}
