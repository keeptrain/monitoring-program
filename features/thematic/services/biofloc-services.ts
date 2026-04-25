import { TABLES } from "@/lib/constants/tables";
import { createClient } from "@/utils/supabase";
import { BioflocProgramFormValues } from "../forms/biofloc-program-schema";
import { ThematicProgramDetail, ThematicProgramIndex } from "../types/thematic";

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
    .limit(20);

  if (error) {
    throw error;
  }

  return data as unknown as ThematicProgramIndex[];
}

export async function getBioflocThematicProgramByIdService(
  id: number,
): Promise<ThematicProgramDetail> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .select(DETAIL_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createBioflocThematicProgramService(
  data: Omit<
    BioflocProgramFormValues,
    "location_name" | "latitude" | "longitude" | "documentations"
  > & {
    location_id: number;
    documentations: NormalizedDocumentation[];
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
