"use server";

import {
  documentationFormRowSchema,
  documentationInsertRowSchema,
  documentationProgramTypeSchema,
  proposalDocumentationFormRowSchema,
  DocumentationFormValue,
  DocumentationInsertRow,
  DocumentationImage,
} from "@/features/documentation/forms/documentation-schema";
import { createClient } from "@/utils/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

type SaveDocumentationsResult = {
  success: boolean;
  groupId: number;
  groupIds: number[];
  insertedCount: number;
  error?: string;
};

/**
 * Representasi satu grup dokumentasi (Before/After) yang dikembalikan ke UI.
 * Kini menggunakan objek DocumentationImage untuk mendukung file_name.
 */
export type ProgramDocumentationGroup = {
  programId: number;
  groupId: string | number | null;
  beforeImages: DocumentationImage[];
  afterImages: DocumentationImage[];
  beforeUrls: string[];
  afterUrls: string[];
  allUrls: string[];
};

const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "demo";
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";

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

function toPublicStorageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!SUPABASE_URL) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${normalizeStoragePath(path)}`;
}

function mapToDocumentationRows(
  programId: number,
  programType: string,
  documentations: DocumentationFormValue["documentations"],
): { rows: DocumentationInsertRow[]; groupIds: number[] } {
  const normalizedProgramType =
    documentationProgramTypeSchema.parse(programType);
  const beforeType =
    normalizedProgramType === "proposal_biofloc_thematic"
      ? "proposal_before"
      : "before";

  const baseGroupId = Date.now();
  const groupIds: number[] = [];
  const rows = (documentations ?? []).flatMap((documentation, index) => {
    const row =
      normalizedProgramType === "proposal_biofloc_thematic"
        ? proposalDocumentationFormRowSchema.parse(documentation)
        : documentationFormRowSchema.parse(documentation);
    const groupId = String(baseGroupId + index); // Consistent with schema (string)
    groupIds.push(Number(groupId));

    const mappedRows: DocumentationInsertRow[] = [];

    for (const img of row.image_before_paths) {
      mappedRows.push({
        program_type: normalizedProgramType,
        program_id: programId,
        group_id: groupId,
        type: beforeType,
        path: normalizeStoragePath(img.path),
        file_name: img.file_name,
      });
    }

    for (const img of row.image_after_paths) {
      mappedRows.push({
        program_type: normalizedProgramType,
        program_id: programId,
        group_id: groupId,
        type: "after",
        path: normalizeStoragePath(img.path),
        file_name: img.file_name,
      });
    }

    return mappedRows;
  });

  return { rows, groupIds: groupIds };
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

type DocumentationProgramIdsQueryParams = {
  programType: string;
  programIds: number[];
};

type DocumentationProgramIdQueryParams = {
  programType: string;
  programId: number;
};

type DocumentationQueryRow = {
  id: number;
  program_id: number;
  group_id: string | number | null;
  type: "before" | "after" | "proposal_before";
  path: string;
  file_name: string;
  created_at: string | null;
};

function isBeforeDocumentationType(type: DocumentationQueryRow["type"]): boolean {
  return type === "before" || type === "proposal_before";
}

export async function getDocumentationsByTypeAndId(type: string, id: number) {
  const supabase = await createClient();
  return getDocumentationsByProgramId(supabase, {
    programType: type,
    programId: id,
  });
}

export async function getDocumentationsByProgramIds(
  supabase: SupabaseClient,
  params: DocumentationProgramIdsQueryParams,
): Promise<Map<number, ProgramDocumentationGroup>> {
  const normalizedProgramType = documentationProgramTypeSchema.parse(
    params.programType,
  );
  const normalizedProgramIds = Array.from(
    new Set(params.programIds.filter((id) => Number.isInteger(id) && id > 0)),
  );

  if (normalizedProgramIds.length === 0) {
    return new Map();
  }

  const { data, error } = await supabase
    .from("documentations")
    .select("id, program_id, group_id, type, path, file_name, created_at")
    .eq("program_type", normalizedProgramType)
    .in("program_id", normalizedProgramIds)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const groupedByProgram = new Map<number, ProgramDocumentationGroup>();

  // Catatan: logika ranking grup disederhanakan untuk kebutuhan Map per-program (biasanya hanya ambil satu grup terbaru)
  for (const row of (data ?? []) as DocumentationQueryRow[]) {
    const normalizedPath = normalizeStoragePath(row.path);
    const publicUrl = toPublicStorageUrl(normalizedPath);
    const imgObj = { path: normalizedPath, file_name: row.file_name };

    const existing = groupedByProgram.get(row.program_id);

    if (!existing) {
      groupedByProgram.set(row.program_id, {
        programId: row.program_id,
        groupId: row.group_id,
        beforeImages: isBeforeDocumentationType(row.type) ? [imgObj] : [],
        afterImages: row.type === "after" ? [imgObj] : [],
        beforeUrls: isBeforeDocumentationType(row.type) ? [publicUrl] : [],
        afterUrls: row.type === "after" ? [publicUrl] : [],
        allUrls: [publicUrl],
      });
      continue;
    }

    if (isBeforeDocumentationType(row.type)) {
      existing.beforeImages.push(imgObj);
      existing.beforeUrls.push(publicUrl);
    } else {
      existing.afterImages.push(imgObj);
      existing.afterUrls.push(publicUrl);
    }
    existing.allUrls.push(publicUrl);
  }

  return groupedByProgram;
}

export async function getDocumentationsByProgramId(
  supabase: SupabaseClient,
  params: DocumentationProgramIdQueryParams,
): Promise<ProgramDocumentationGroup | null> {
  const groupedByProgram = await getDocumentationsByProgramIds(supabase, {
    programType: params.programType,
    programIds: [params.programId],
  });

  return groupedByProgram.get(params.programId) ?? null;
}

export async function getDocumentationGroupsByProgramId(
  supabase: SupabaseClient,
  params: DocumentationProgramIdQueryParams,
): Promise<ProgramDocumentationGroup[]> {
  const normalizedProgramType = documentationProgramTypeSchema.parse(
    params.programType,
  );
  const programId = params.programId;

  if (!Number.isInteger(programId) || programId <= 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("documentations")
    .select("id, program_id, group_id, type, path, file_name, created_at")
    .eq("program_type", normalizedProgramType)
    .eq("program_id", programId)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const groupMap = new Map<string, ProgramDocumentationGroup>();

  for (const row of (data ?? []) as DocumentationQueryRow[]) {
    const groupKey = String(row.group_id ?? row.id);
    const normalizedPath = normalizeStoragePath(row.path);
    const publicUrl = toPublicStorageUrl(normalizedPath);
    const imgObj = { path: normalizedPath, file_name: row.file_name };

    const existing = groupMap.get(groupKey);
    if (!existing) {
      groupMap.set(groupKey, {
        programId: row.program_id,
        groupId: row.group_id,
        beforeImages: isBeforeDocumentationType(row.type) ? [imgObj] : [],
        afterImages: row.type === "after" ? [imgObj] : [],
        beforeUrls: isBeforeDocumentationType(row.type) ? [publicUrl] : [],
        afterUrls: row.type === "after" ? [publicUrl] : [],
        allUrls: [publicUrl],
      });
    } else {
      if (isBeforeDocumentationType(row.type)) {
        existing.beforeImages.push(imgObj);
        existing.beforeUrls.push(publicUrl);
      } else {
        existing.afterImages.push(imgObj);
        existing.afterUrls.push(publicUrl);
      }
      existing.allUrls.push(publicUrl);
    }
  }

  return Array.from(groupMap.values());
}

export async function getDocumentationGroupsByTypeAndId(
  type: string,
  id: number,
): Promise<ProgramDocumentationGroup[]> {
  const supabase = await createClient();
  return getDocumentationGroupsByProgramId(supabase, {
    programType: type,
    programId: id,
  });
}

export async function upsertDocumentations(
  programId: number,
  programType: string,
  documentations: DocumentationFormValue["documentations"],
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await createClient();
    const normalizedProgramType =
      documentationProgramTypeSchema.parse(programType);

    // Step 1: Delete existing documentations for this program
    const { error: deleteError } = await supabase
      .from("documentations")
      .delete()
      .eq("program_type", normalizedProgramType)
      .eq("program_id", programId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    // Step 2: Insert new documentations (if any)
    if (documentations && documentations.length > 0) {
      const mapped = mapToDocumentationRows(
        programId,
        programType,
        documentations,
      );
      const rows = mapped.rows.map((row) =>
        documentationInsertRowSchema.parse(row),
      );

      if (rows.length > 0) {
        const { error: insertError } = await supabase
          .from("documentations")
          .insert(rows);

        if (insertError) {
          throw new Error(insertError.message);
        }
      }
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal memperbarui dokumentasi.",
    };
  }
}

export { saveDocumentationsAction as insertDocumentations };
