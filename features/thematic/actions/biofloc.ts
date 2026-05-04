"use server";

import { BioflocProgramFormValues } from "../forms/biofloc-program-schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as db from "../services/biofloc-services";
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

export async function updateThematicPrograms(
  id: string,
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
