"use server";

import { BioflocProgramFormValues } from "../forms/biofloc-program-schema";
import { revalidatePath } from "next/cache";
import * as db from "../services/biofloc-services";
import { createClient } from "@/utils/supabase";
import { TABLES } from "@/lib/constants/tables";

import {
  BioflocProgramsPaginatedInput,
  bioflocProgramsPaginatedSchema,
} from "../forms/biofloc-program-query-schema";
import { ProposalIdentityFormValues } from "@/features/proposal/forms/proposal-identity-schema";
import { ProposalLocationValues } from "@/features/proposal/forms/proposal-location-schema";
import { ThematicProgramFormValues } from "../forms/thematic-program-schema";
import { THEMATIC_CONFIG } from "../constants/thematic-constants";
import { getSession } from "@/features/auth/session";

export async function getThematicProgramsPaginated(
  thematicType: string,
  input: BioflocProgramsPaginatedInput,
) {
  const parsed = bioflocProgramsPaginatedSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Parameter daftar program tematik tidak valid.");
  }

  return db.getThematicProgramsPaginatedService(thematicType, parsed.data);
}

export async function getThematicProgramById(id: string) {
  // Get user session to determine program scope
  const session = await getSession();

  if (!session.isLoggedIn) {
    throw new Error("Unauthorized: User must be logged in");
  }

  const programType =
    session.programScope === "biofloc"
      ? "biofloc_thematic"
      : "minapadi_thematic";

  const config = THEMATIC_CONFIG[programType];

  return db.getThematicProgramByIdService(id, config);
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
  const session = await getSession();
  if (!session.isLoggedIn) {
    throw new Error("Unauthorized: User must be logged in");
  }

  const programType =
    session.programScope === "minapadi"
      ? "minapadi_thematic"
      : "biofloc_thematic";
  const config = THEMATIC_CONFIG[programType];

  const supabase = await createClient();
  const { error } = await supabase
    .from(config.programTable)
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
    message: "Program berhasil diperbarui",
  };
}

export async function updateKdmpEntity(
  entityId: string | number,
  data: ProposalIdentityFormValues,
) {
  try {
    await db.updateKdmpEntityService(entityId, data);
    const session = await getSession();
    const scope = session.programScope === "minapadi" ? "minapadi" : "biofloc";
    revalidatePath(`/dashboard/thematic/${scope}`);
  } catch (error) {
    console.error("Error updating KDMP entity:", error);
    throw error;
  }
}

export async function updateLocation(
  locationId: string | number,
  data: ProposalLocationValues,
  proposalId?: string | null,
) {
  try {
    await db.updateLocationService(locationId, data, proposalId);
    const session = await getSession();
    const scope = session.programScope === "minapadi" ? "minapadi" : "biofloc";
    revalidatePath(`/dashboard/thematic/${scope}`);
  } catch (error) {
    console.error("Error updating location:", error);
    throw error;
  }
}

export async function deleteThematicProgram(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      throw new Error("Unauthorized: User must be logged in");
    }

    const programType =
      session.programScope === "minapadi"
        ? "minapadi_thematic"
        : "biofloc_thematic";
    const config = THEMATIC_CONFIG[programType];

    await db.deleteBioflocThematicProgramService(id, config);
    
    const scope = session.programScope === "minapadi" ? "minapadi" : "biofloc";
    revalidatePath(`/dashboard/thematic/${scope}`);
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
