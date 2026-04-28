"use server";

import { revalidatePath } from "next/cache";
import {
  ProposalBioflocFormValues,
  proposalBioflocSchema,
} from "../forms/proposal-biofloc-schema";
import * as db from "../services/proposal-biofloc-services";
import { ProposalBioflocStatus } from "../types/thematic";
import { BioflocProgramFormValues } from "../forms/biofloc-program-schema";
export type {
  ProposalBioflocThematicProgram,
  ProposalBioflocDetail,
  ProposalBioflocPaginationParams,
  PaginatedProposalBioflocResult,
} from "../services/proposal-biofloc-services";

export async function createProposalBioflocThematicProgram(
  payload: ProposalBioflocFormValues,
): Promise<{ success: boolean; message: string }> {
  const {
    success,
    error,
    data: parsedData,
  } = proposalBioflocSchema.safeParse(payload);

  if (!success) {
    return {
      success: false,
      message: "Validasi data dari form ditolak server: " + error.message,
    };
  }

  try {
    await db.createProposalBioflocThematicProgramService(parsedData);
    return {
      success: true,
      message: "Proposal berhasil diajukan",
    };
  } catch (error) {
    return { success: false, message: "Error create proposal: " + error };
  }
}

export async function getProposalBioflocThematicPrograms() {
  return db.getProposalBioflocThematicProgramsService();
}

export async function getProposalBioflocPaginated(
  params: db.ProposalBioflocPaginationParams,
) {
  return db.getProposalBioflocPaginatedService(params);
}

export async function updateProposalBioflocStatus(
  id: number,
  status: ProposalBioflocStatus,
) {
  const data = await db.updateProposalStatusService(id, status);

  revalidatePath("/monitoring");
  revalidatePath("/monitoring/biofloc_thematic/proposal");
  revalidatePath("/monitoring/biofloc_thematic/bantuan-2025");

  return data;
}

export async function createSignedUrlForProposalBiofloc(id: number) {
  const { blob, originalPath } = await db.createSignedUrl(id);
  const fileName = originalPath.split("/").pop();
  return { blob, fileName };
}

export async function getProposalBioflocDetail(id: number) {
  return db.getProposalBioflocDetailService(id);
}

export async function convertProposalToProgram(
  proposalId: number,
  values: BioflocProgramFormValues,
): Promise<{ success: boolean; message: string }> {
  try {
    await db.convertProposalToThematicProgramService(proposalId, values);
    return {
      success: true,
      message: "Proposal berhasil diubah menjadi program",
    };
  } catch (error) {
    return { success: false, message: "Error convert proposal: " + error };
  }
}
