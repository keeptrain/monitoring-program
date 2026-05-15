"use server";

import * as db from "../services/proposal-biofloc-services";
import { ProposalBioflocPaginationParams } from "@/features/proposal/types/proposal-biofloc";
import { getSession } from "@/features/auth/session";
import {
  ProposalVerificationFormValues,
  proposalVerificationSchema,
} from "../forms/proposal-verification-schema";
import { ThematicProgramFormValues } from "../forms/thematic-program-schema";
import { resolveThematicMetadata } from "../constants/thematic-constants";

export async function getProposalThematicPaginated(
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

export async function verifyProposalThematic(
  id: string,
  values: ProposalVerificationFormValues,
) {
  const { role, sub, programScope } = await getSession();

  if (role !== "pmo") {
    throw new Error("Anda tidak memiliki akses untuk memverifikasi proposal");
  }

  const validateStatus = proposalVerificationSchema.safeParse(values);

  if (!validateStatus.success) {
    throw new Error("Status proposal tidak valid");
  }

  const programType = programScope?.includes("minapadi")
    ? "minapadi_thematic"
    : "biofloc_thematic";

  const result = await db.verifyProposalThematicService(
    id,
    sub,
    validateStatus.data,
    programType,
  );

  return result;
}

export async function downloadProposalThematic(id: string) {
  const { isLoggedIn, programScope } = await getSession();

  if (!isLoggedIn) {
    return { success: false, message: "Unauthenticated" };
  }

  const { proposalTable } = resolveThematicMetadata(programScope);

  try {
    const { blob, originalPath } = await db.getProposalThematicFileService(
      id,
      proposalTable,
    );

    const fileName = originalPath.split("/").pop() || "proposal.pdf";

    return {
      success: true,
      message: "Berhasil mengunduh proposal",
      data: { blob, fileName },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal mengunduh proposal",
    };
  }
}

/**
 * Get proposal detail with ownership verification
 * - PMO and Admin can view any proposal
 * - Officers can only view their own proposals (based on sub)
 */
export async function getProposalThematic(id: string) {
  const { sub, role, programScope, isLoggedIn } = await getSession();

  if (!isLoggedIn || !sub) {
    return {
      success: false,
      message: "Unauthenticated",
      data: null,
    };
  }

  const { proposalTable } = resolveThematicMetadata(programScope);

  try {
    const data = await db.getProposalThematicService(id, proposalTable);

    // Authorization check for officer role
    if (role === "officer") {
      if (data.user_id !== sub) {
        throw new Error("Unauthorized");
      }
    }

    return {
      success: true,
      message: "Successfully fetched proposal thematic detail",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch proposal thematic detail",
      data: null,
    };
  }
}

export async function convertProposalToProgram(
  proposalId: string,
  values: ThematicProgramFormValues,
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
