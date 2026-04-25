"use server";

import { revalidatePath } from "next/cache";
import { ProposalBioflocFormValues } from "../forms/proposal-biofloc-schema";
import * as db from "../services/proposal-biofloc-services";
import { ProposalBioflocStatus } from "../types/thematic";
export type {
  ProposalBioflocThematicProgram,
  ProposalBioflocPaginationParams,
  PaginatedProposalBioflocResult,
} from "../services/proposal-biofloc-services";

export async function createProposalBioflocThematicProgram(
  payload: ProposalBioflocFormValues,
) {
  const data = await db.createProposalBioflocThematicProgramService(payload);

  revalidatePath("/monitoring");
  revalidatePath("/monitoring/biofloc_thematic/proposal");
  revalidatePath("/monitoring/biofloc_thematic/bantuan-2025");

  return data;
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
