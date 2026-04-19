"use server";

import {
  documentationFormRowSchema,
  documentationInsertRowSchema,
  documentationProgramTypeSchema,
  DocumentationFormValue,
  DocumentationInsertRow,
} from "@/features/documentation/documentation-schema";
import { createClient } from "@/utils/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

type SaveDocumentationsResult = {
  success: boolean;
  groupId: number;
  groupIds: number[];
  insertedCount: number;
  error?: string;
};

export type ProgramDocumentationGroup = {
  programId: number;
  groupId: string | number | null;
  beforePaths: string[];
  afterPaths: string[];
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
  type: "before" | "after";
  path: string;
  created_at: string | null;
};

type ProgramDocumentationAccumulator = ProgramDocumentationGroup & {
  groupRank: bigint;
};

function getGroupRank(
  groupId: string | number | null,
  createdAt: string | null,
  id: number,
): bigint {
  if (groupId !== null) {
    try {
      return typeof groupId === "number" ? BigInt(groupId) : BigInt(groupId);
    } catch {
      // fall through to created_at/id fallback
    }
  }

  const createdAtMs = createdAt ? new Date(createdAt).getTime() : 0;
  if (!Number.isNaN(createdAtMs) && createdAtMs > 0) {
    return BigInt(createdAtMs);
  }
  return BigInt(id);
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
    .select("id, program_id, group_id, type, path, created_at")
    .eq("program_type", normalizedProgramType)
    .in("program_id", normalizedProgramIds)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const groupedByProgram = new Map<number, ProgramDocumentationAccumulator>();

  for (const row of (data ?? []) as DocumentationQueryRow[]) {
    const existing = groupedByProgram.get(row.program_id);
    const rowRank = getGroupRank(row.group_id, row.created_at, row.id);

    if (existing && rowRank < existing.groupRank) {
      continue;
    }

    const normalizedPath = normalizeStoragePath(row.path);
    const publicUrl = toPublicStorageUrl(normalizedPath);

    if (!existing || rowRank > existing.groupRank) {
      groupedByProgram.set(row.program_id, {
        programId: row.program_id,
        groupId: row.group_id,
        beforePaths: row.type === "before" ? [normalizedPath] : [],
        afterPaths: row.type === "after" ? [normalizedPath] : [],
        beforeUrls: row.type === "before" ? [publicUrl] : [],
        afterUrls: row.type === "after" ? [publicUrl] : [],
        allUrls: [publicUrl],
        groupRank: rowRank,
      });
      continue;
    }

    if (row.type === "before") {
      existing.beforePaths.push(normalizedPath);
      existing.beforeUrls.push(publicUrl);
    } else {
      existing.afterPaths.push(normalizedPath);
      existing.afterUrls.push(publicUrl);
    }
    existing.allUrls.push(publicUrl);
  }

  return new Map(
    Array.from(groupedByProgram.entries()).map(([programId, group]) => {
      const { groupRank: _groupRank, ...publicGroup } = group;
      return [programId, publicGroup];
    }),
  );
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

/**
 * Returns ALL documentation groups for a single program_id.
 * Each group_id produces a separate ProgramDocumentationGroup.
 */
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
    .select("id, program_id, group_id, type, path, created_at")
    .eq("program_type", normalizedProgramType)
    .eq("program_id", programId)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  // Group by group_id
  const groupMap = new Map<string, ProgramDocumentationGroup>();

  for (const row of (data ?? []) as DocumentationQueryRow[]) {
    const groupKey = String(row.group_id ?? row.id);
    const normalizedPath = normalizeStoragePath(row.path);
    const publicUrl = toPublicStorageUrl(normalizedPath);

    const existing = groupMap.get(groupKey);
    if (!existing) {
      groupMap.set(groupKey, {
        programId: row.program_id,
        groupId: row.group_id,
        beforePaths: row.type === "before" ? [normalizedPath] : [],
        afterPaths: row.type === "after" ? [normalizedPath] : [],
        beforeUrls: row.type === "before" ? [publicUrl] : [],
        afterUrls: row.type === "after" ? [publicUrl] : [],
        allUrls: [publicUrl],
      });
    } else {
      if (row.type === "before") {
        existing.beforePaths.push(normalizedPath);
        existing.beforeUrls.push(publicUrl);
      } else {
        existing.afterPaths.push(normalizedPath);
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

export { saveDocumentationsAction as insertDocumentations };
