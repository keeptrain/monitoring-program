"use server";

import { revalidatePath } from "next/cache";
import * as db from "../services/proposal-biofloc-services";
import {
  ProposalBioflocStatus,
  ProposalBioflocPaginationParams,
} from "@/features/proposal/types/proposal-biofloc";
import { BioflocProgramFormValues } from "../forms/biofloc-program-schema";
import { getSession } from "@/features/auth/session";
import z from "zod";
import {
  ProposalVerificationFormValues,
  proposalVerificationSchema,
} from "@/features/monitoring/components/biofloc/ProposalSubmissionTableColumns";

export async function getProposalBioflocPaginated(
  params: ProposalBioflocPaginationParams,
) {
  return db.getProposalBioflocPaginatedService(params);
}

export async function verifyProposalBiofloc(
  id: string,
  values: ProposalVerificationFormValues,
) {
  const { role, sub } = await getSession();

  if (role !== "pmo") {
    throw new Error("Anda tidak memiliki akses untuk memverifikasi proposal");
  }

  const validateStatus = proposalVerificationSchema.safeParse(values);

  if (!validateStatus.success) {
    throw new Error("Status proposal tidak valid");
  }

  const result = await db.verifyProposalBioflocService(
    id,
    sub,
    validateStatus.data,
  );

  return result;
}

export async function createSignedUrlForProposalBiofloc(id: string) {
  const { blob, originalPath } = await db.createSignedUrl(id);
  const fileName = originalPath.split("/").pop();
  return { blob, fileName };
}

export async function getProposalBioflocDetail(id: string) {
  return db.getProposalBioflocDetailService(id);
}

export async function convertProposalToProgram(
  proposalId: string,
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
