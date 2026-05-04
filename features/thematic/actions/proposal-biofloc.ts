"use server";

import * as db from "../services/proposal-biofloc-services";
import { ProposalBioflocPaginationParams } from "@/features/proposal/types/proposal-biofloc";
import { BioflocProgramFormValues } from "../forms/biofloc-program-schema";
import { getSession } from "@/features/auth/session";
import {
  ProposalVerificationFormValues,
  proposalVerificationSchema,
} from "../forms/proposal-verification-schema";

export async function getProposalBioflocPaginated(
  params: ProposalBioflocPaginationParams,
) {
  const { sub, role, isLoggedIn } = await getSession();

  // Smart logic:
  // 1. If not logged in, no userId filter (public view)
  // 2. If logged in as PMO or Admin, no userId filter (admin view)
  // 3. Otherwise (regular user), filter by their own ID
  const userIdFilter =
    isLoggedIn && (role === "pmo" || role === "admin") ? undefined : sub;

  return db.getProposalBioflocPaginatedService(params, userIdFilter);
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
