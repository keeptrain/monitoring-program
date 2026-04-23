"use server";

import { createClient } from "@/utils/supabase";
import { type SupabaseClient } from "@supabase/supabase-js";
import { ThematicProgramFormValues } from "../forms/thematic-program-schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createLocationFromProgram } from "@/features/dashboard/actions/available-locations";
import { ThematicProgramDetail, ThematicProgramIndex } from "../types/thematic";
import { TABLES } from "@/lib/constants/tables";

export async function getThematicPrograms() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .select(
      `
      id,
      location_id,
      progress_percent,
      updated_at,
      available_locations (
        name
      )
      `,
    )
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as unknown as ThematicProgramIndex[];
}

export async function getThematicProgramById(
  id: number,
  supabase?: SupabaseClient,
): Promise<ThematicProgramDetail> {
  const client = supabase || (await createClient());
  const { data, error } = await client
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .select(
      `
      *,
      available_locations (
        name,
        latitude,
        longitude
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createThematicPrograms(data: ThematicProgramFormValues) {
  const documentations = normalizeDocumentations(data.documentations);

  const supabase = await createClient();

  const locationId = await createLocationFromProgram(supabase, {
    type: "biofloc_thematic",
    name: data.location_name,
    latitude: data.latitude,
    longitude: data.longitude,
  });

  if (locationId === undefined) {
    console.error("Error creating location");
    return;
  }

  // Remove location fields from data before inserting into thematic_programs
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { location_name, latitude, longitude, ...programData } = data;

  const { error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .insert({
      ...programData,
      location_id: locationId,
      documentations,
    });

  if (error) {
    console.error("Error creating thematic program:", error);
    return;
  }

  revalidatePath("/dashboard/thematic");
  redirect("/dashboard/thematic");
}

export async function updateThematicPrograms(
  id: number,
  data: ThematicProgramFormValues,
) {
  const documentations = normalizeDocumentations(data.documentations);

  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .update({
      ...data,
      documentations,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating thematic program:", error);
    return;
  }

  revalidatePath("/dashboard/thematic");
  revalidatePath(`/dashboard/thematic/${id}`);
  revalidatePath(`/dashboard/thematic/form/${id}`);
  redirect("/dashboard/thematic");
}

function normalizeDocumentations(
  data: ThematicProgramFormValues["documentations"],
) {
  return (data ?? []).map((doc) => ({
    id: crypto.randomUUID(),
    image_before_path: doc.image_before_paths?.[0]?.path ?? "",
    image_after_path: doc.image_after_paths?.[0]?.path ?? "",
  }));
}
