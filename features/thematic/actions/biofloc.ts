"use server";

import { BioflocProgramFormValues } from "../forms/biofloc-program-schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createLocationFromProgram } from "@/features/dashboard/actions/available-locations";
import * as db from "../services/biofloc-services";
import { createClient } from "@/utils/supabase";
import { UpdateProgressFormValues } from "../forms/update-progress-schema";
import {
  BioflocProgramsPaginatedInput,
  bioflocProgramsPaginatedSchema,
} from "../forms/biofloc-program-query-schema";

export async function getBioflocProgramsPaginated(
  input: BioflocProgramsPaginatedInput,
) {
  const parsed = bioflocProgramsPaginatedSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Parameter daftar program bioflok tidak valid.");
  }

  return db.getBioflocProgramsPaginatedService(parsed.data);
}

export async function getThematicProgramById(id: number) {
  return db.getBioflocThematicProgramByIdService(id);
}

export async function createThematicPrograms(data: BioflocProgramFormValues) {
  const documentations = db.normalizeDocumentations(data.documentations);

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

  try {
    await db.createBioflocThematicProgramService({
      ...programData,
      location_id: locationId,
      documentations,
    });
  } catch (error) {
    console.error("Error creating thematic program:", error);
    return;
  }

  revalidatePath("/dashboard/thematic");
  redirect("/dashboard/thematic");
}

export async function updateThematicPrograms(
  id: number,
  data: BioflocProgramFormValues,
) {
  const documentations = db.normalizeDocumentations(data.documentations);

  try {
    await db.updateBioflocThematicProgramService(id, {
      ...data,
      documentations,
    });
  } catch (error) {
    console.error("Error updating thematic program:", error);
    return;
  }

  revalidatePath("/dashboard/thematic");
  revalidatePath(`/dashboard/thematic/${id}`);
  revalidatePath(`/dashboard/thematic/form/${id}`);
  redirect("/dashboard/thematic");
}

export async function updateThematicProgramProgress(
  id: number,
  data: UpdateProgressFormValues,
) {
  try {
    await db.updateBioflocThematicProgramProgressService(
      id,
      data.progress_percent,
    );
  } catch (error) {
    console.error("Error updating thematic program progress:", error);
    throw error;
  }

  revalidatePath("/dashboard/thematic");
  revalidatePath(`/dashboard/thematic/${id}`);
}

export async function deleteThematicProgram(id: number) {
  try {
    await db.deleteBioflocThematicProgramService(id);
  } catch (error) {
    console.error("Error deleting thematic program:", error);
    throw error;
  }

  revalidatePath("/dashboard/thematic");
  redirect("/dashboard/thematic");
}
