import { TABLES } from "@/lib/constants/tables";
import { createClient } from "@/utils/supabase";
import { BioflocProgramFormValues } from "../forms/biofloc-program-schema";
import {
  BioflocProgramListItem,
  BioflocProgramsPaginatedResult,
  ThematicProgramDetail,
  ThematicProgramIndex,
} from "../types/thematic";
import { BioflocProgramsPaginatedParams } from "../forms/biofloc-program-query-schema";

type NormalizedDocumentation = {
  id: string;
  image_before_path: string;
  image_after_path: string;
};

const LIST_SELECT = `
      id,
      location_id,
      name,
      progress_percent,
      updated_at,
      available_locations (
        name
      )
      ` as const;

const DETAIL_SELECT = `
      *,
      available_locations (
        name,
        latitude,
        longitude
      )
    ` as const;

export function normalizeDocumentations(
  data: BioflocProgramFormValues["documentations"],
): NormalizedDocumentation[] {
  return (data ?? []).map((doc) => ({
    id: crypto.randomUUID(),
    image_before_path: doc.image_before_paths?.[0]?.path ?? "",
    image_after_path: doc.image_after_paths?.[0]?.path ?? "",
  }));
}

export async function getBioflocThematicProgramsService() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .select(LIST_SELECT)
    .order("updated_at", { ascending: false })
    .limit(10);

  if (error) {
    throw error;
  }

  return data as unknown as ThematicProgramIndex[];
}

const INTERNAL_PAGINATED_SELECT = `
  id,
  name,
  kusuka_number,
  commodity_aid,
  progress_percent,
  distribution_amount,
  total_management,
  created_at,
  updated_at,
  available_locations!inner (
    name,
    province_id
  )
` as const;

const PUBLIC_PAGINATED_SELECT = `
  id,
  name,
  commodity_aid,
  progress_percent,
  distribution_amount,
  total_management,
  created_at,
  updated_at,
  available_locations!inner (
    name,
    province_id
  )
` as const;

type BioflocProgramListRow = {
  id: number;
  name: string;
  kusuka_number?: string;
  commodity_aid: string;
  progress_percent: number;
  distribution_amount: number;
  total_management: number;
  created_at: string;
  updated_at: string;
  available_locations: {
    name: string;
    province_id: string;
  } | null;
};

export async function getBioflocProgramsPaginatedService(
  params: BioflocProgramsPaginatedParams,
): Promise<BioflocProgramsPaginatedResult> {
  const supabase = await createClient();
  const { page, pageSize, province, scope, search, year } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const selectColumns =
    scope === "internal" ? INTERNAL_PAGINATED_SELECT : PUBLIC_PAGINATED_SELECT;

  let query = supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .select(selectColumns, { count: "exact" });

  if (search.length > 0) {
    query = query.ilike("name", `%${search}%`);
  }

  if (province.length > 0) {
    query = query.eq("available_locations.province_id", province);
  }

  if (year && year > 0) {
    query = query.eq("fiscal_year", year);
  }

  const { data, error, count } = await query
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as unknown as BioflocProgramListRow[];
  const mappedRows: BioflocProgramListItem[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    location_name: row.available_locations?.name ?? "-",
    commodity_aid: row.commodity_aid,
    progress_percent: row.progress_percent,
    distribution_amount: row.distribution_amount,
    total_management: row.total_management,
    created_at: row.created_at,
    updated_at: row.updated_at,
    year: new Date(row.created_at).getUTCFullYear(),
    ...(scope === "internal" ? { kusuka_number: row.kusuka_number ?? "" } : {}),
  }));

  const total = count ?? 0;
  return {
    data: mappedRows,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getBioflocThematicProgramByIdService(
  id: number,
): Promise<ThematicProgramDetail> {
  const supabase = await createClient();

  // 1. Fetch program data
  const { data: program, error: programError } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .select(DETAIL_SELECT)
    .eq("id", id)
    .single();

  if (programError) {
    throw programError;
  }

  // 2. Fetch documentations from the documentations table
  const { data: docs, error: docsError } = await supabase
    .from("documentations")
    .select("*")
    .eq("program_type", "biofloc_thematic")
    .eq("program_id", id);

  if (docsError) {
    console.error("Error fetching documentations:", docsError);
    // Continue even if docs fail, just return empty list
  }

  // 3. Group documentations by group_id
  interface DocGroup {
    id: string;
    image_before_path: string | null;
    image_after_path: string | null;
    created_at: string;
    updated_at: string;
  }
  const docGroups: Record<string, DocGroup> = {};
  (docs || []).forEach((d) => {
    if (!docGroups[d.group_id]) {
      docGroups[d.group_id] = {
        id: d.group_id,
        image_before_path: null,
        image_after_path: null,
        created_at: d.created_at,
        updated_at: d.updated_at,
      };
    }
    if (d.type === "before") {
      docGroups[d.group_id].image_before_path = d.path;
    } else {
      docGroups[d.group_id].image_after_path = d.path;
    }
  });

  return {
    ...program,
    documentations: Object.values(docGroups),
  } as unknown as ThematicProgramDetail;
}

export async function createBioflocThematicProgramService(
  data: Omit<
    BioflocProgramFormValues,
    "location_name" | "latitude" | "longitude" | "documentations"
  > & {
    location_id: number;
    documentations: NormalizedDocumentation[];
    proposal_id?: number;
  },
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .insert(data);

  if (error) {
    throw error;
  }
}

export async function updateBioflocThematicProgramService(
  id: number,
  data: Omit<BioflocProgramFormValues, "documentations"> & {
    documentations: NormalizedDocumentation[];
  },
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function updateBioflocThematicProgramProgressService(
  id: number,
  progress_percent: number,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .update({
      progress_percent,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteBioflocThematicProgramService(id: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}
