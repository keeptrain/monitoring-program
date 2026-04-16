"use server";

import { createClient } from "@supabase/supabase-js";

export type PublicDocumentation = {
  id: string;
  image_before_path: string | null;
  image_after_path: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type PublicDocumentationResponse = {
  offset: number;
  limit: number;
  total: number;
  has_more: boolean;
  documentations: PublicDocumentation[];
};

export async function getPublicAvailableDocumentations(
  reportId: number,
  offset: number = 0,
  limit: number = 5,
): Promise<PublicDocumentationResponse> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase configuration is missing");
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
    throw new Error("Failed to fetch documentation");
  }

  const rawDocumentations = Array.isArray(data?.documentations)
    ? data.documentations
    : [];

  const allDocumentations = rawDocumentations.map((documentation, index) => {
    const item = documentation as Partial<PublicDocumentation>;

    return {
      id: item.id ?? String(index),
      image_before_path: item.image_before_path ?? null,
      image_after_path: item.image_after_path ?? null,
      created_at: item.created_at ?? null,
      updated_at: item.updated_at ?? null,
    };
  });

  const pagedDocumentations = allDocumentations.slice(offset, offset + limit);
  const hasMore =
    offset + pagedDocumentations.length < allDocumentations.length;

  return {
    offset,
    limit,
    total: allDocumentations.length,
    has_more: hasMore,
    documentations: pagedDocumentations,
  };
}
