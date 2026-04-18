"use server";

import {
  documentationFormRowSchema,
  documentationInsertRowSchema,
  documentationProgramTypeSchema,
  DocumentationFormValue,
  DocumentationInsertRow,
} from "@/features/documentation/documentation-schema";
import { SupabaseClient } from "@supabase/supabase-js";

type SaveDocumentationsResult = {
  success: boolean;
  groupId: number;
  groupIds: number[];
  insertedCount: number;
  error?: string;
};

const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "demo";

function normalizeStoragePath(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    const url = new URL(path);
    const match = url.pathname.match(/\/object\/public\/[^/]+\/(.+)$/);
    if (match?.[1]) {
      return decodeURIComponent(match[1]).replace(/^\/+/, "");
    }
  }

  const normalized = path.replace(/^\/+/, "");
  if (normalized.startsWith(`${BUCKET_NAME}/`)) {
    return normalized.slice(BUCKET_NAME.length + 1);
  }
  return normalized;
}

function mapToDocumentationRows(
  programId: number,
  programType: string,
  documentations: DocumentationFormValue["documentations"],
): { rows: DocumentationInsertRow[]; groupIds: number[] } {
  const normalizedProgramType =
    documentationProgramTypeSchema.parse(programType);

  const baseGroupId = Date.now();
  const groupIds: number[] = [];
  const rows = documentations.flatMap((documentation, index) => {
    const row = documentationFormRowSchema.parse(documentation);
    const groupId = baseGroupId + index;
    groupIds.push(groupId);

    const mappedRows: DocumentationInsertRow[] = [];

    for (const beforePath of row.image_before_paths) {
      mappedRows.push({
        program_type: normalizedProgramType,
        program_id: programId,
        group_id: groupId,
        type: "before",
        path: normalizeStoragePath(beforePath),
      });
    }

    for (const afterPath of row.image_after_paths) {
      mappedRows.push({
        program_type: normalizedProgramType,
        program_id: programId,
        group_id: groupId,
        type: "after",
        path: normalizeStoragePath(afterPath),
      });
    }

    return mappedRows;
  });

  return { rows, groupIds };
}

export async function saveDocumentationsAction(
  supabase: SupabaseClient,
  programId: number,
  programType: string,
  documentations: DocumentationFormValue["documentations"],
): Promise<SaveDocumentationsResult> {
  const groupIds: number[] = [];
  const groupId = Date.now();

  try {
    if (!Number.isInteger(programId) || programId <= 0) {
      throw new Error("Program ID tidak valid.");
    }

    if (!Array.isArray(documentations) || documentations.length === 0) {
      throw new Error("Dokumentasi wajib diisi.");
    }

    const mapped = mapToDocumentationRows(
      programId,
      programType,
      documentations,
    );
    const mappedRows = mapped.rows.map((row) =>
      documentationInsertRowSchema.parse(row),
    );
    groupIds.push(...mapped.groupIds);

    if (mappedRows.length === 0) {
      throw new Error("Tidak ada data dokumentasi yang dapat disimpan.");
    }

    const { error } = await supabase.from("documentations").insert(mappedRows);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      groupId: groupIds[0] ?? groupId,
      groupIds,
      insertedCount: mappedRows.length,
    };
  } catch (error) {
    return {
      success: false,
      groupId,
      groupIds,
      insertedCount: 0,
      error:
        error instanceof Error ? error.message : "Gagal menyimpan dokumentasi.",
    };
  }
}

export { saveDocumentationsAction as insertDocumentations };
