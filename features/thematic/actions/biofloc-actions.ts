"use server";

import { BioflocProgramFormValues } from "../forms/biofloc-program-schema";
import { revalidatePath } from "next/cache";
import * as db from "../services/biofloc-services";
import { createClient } from "@/utils/supabase";
import { TABLES } from "@/lib/constants/tables";
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

export async function getThematicProgramById(id: string) {
  return db.getBioflocThematicProgramByIdService(id);
}

export async function createThematicProgram(
  data: BioflocProgramFormValues,
): Promise<{ success: boolean; message?: string }> {
  try {
    await db.createBioflocThematicService(data);
    return { success: true, message: "Program berhasil dibuat" };
  } catch (error) {
    console.error("Error creating thematic program:", error);
    return { success: false, message: "Gagal membuat program" };
  }
}

export async function downloadSCurveFile(id: string) {
  const { blob, originalPath } = await db.downloadSCurveFileService(id);
  const fileName = originalPath.split("/").pop();
  return { blob, fileName };
}

export async function updateThematicProgram(
  id: string,
  data: ThematicProgramFormValues,
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .update({
      progress_percent: data.progress_percent,
      commodity_aid: data.commodity_aid,
      commodity_potential: data.commodity_potential,
      land_area: data.land_area,
      production_value: data.production_value,
      distribution_amount: data.distribution_amount,
      sppg_partner: data.sppg_partner,
      s_curve_path: data.s_curve_path,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating thematic program:", error);
    throw error;
  }

  return {
    success: true,
    message: "Proposal berhasil diperbarui",
  };
}

import { IdentifyKdmpFormValues } from "@/features/proposal/forms/identify-kdmp-schema";
import { LocationKdmpValues } from "@/features/proposal/forms/location-kdmp-schema";
import { ThematicProgramFormValues } from "../forms/thematic-program-schema";

export async function updateKdmpEntity(
  entityId: string | number,
  data: IdentifyKdmpFormValues,
) {
  try {
    await db.updateKdmpEntityService(entityId, data);
    revalidatePath("/dashboard/thematic");
  } catch (error) {
    console.error("Error updating KDMP entity:", error);
    throw error;
  }
}

export async function updateLocation(
  locationId: string | number,
  data: LocationKdmpValues,
) {
  try {
    await db.updateLocationService(locationId, data);
  } catch (error) {
    console.error("Error updating location:", error);
    throw error;
  }
}

export async function updateThematicProgramProgress(
  id: string,
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

export async function deleteThematicProgram(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    await db.deleteBioflocThematicProgramService(id);
    // revalidatePath("/dashboard/thematic/biofloc");
    return { success: true };
  } catch (error) {
    console.error("Error deleting thematic program:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal menghapus program",
    };
  }
}
