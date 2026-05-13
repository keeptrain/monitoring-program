"use server";

import * as db from "../services/proposal-biofloc-services";
import { ProposalBioflocPaginationParams } from "@/features/proposal/types/proposal-biofloc";
import { getSession } from "@/features/auth/session";
import {
  ProposalVerificationFormValues,
  proposalVerificationSchema,
} from "../forms/proposal-verification-schema";
import { createClient } from "@/utils/supabase";
import { TABLES } from "@/lib/constants/tables";
import { ThematicProgramFormValues } from "../forms/thematic-program-schema";

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

/**
 * Get proposal detail with ownership verification
 * - PMO and Admin can view any proposal
 * - Officers can only view their own proposals (based on sub)
 */
export async function getProposalBioflocDetail(id: string) {
  const { sub, role, isLoggedIn } = await getSession();

  if (!isLoggedIn || !sub) {
    return {
      success: false,
      message: "Unauthorized",
      data: null,
    };
  }

  try {
    const data = await db.getProposalBioflocDetailService(id);

    // PMO and Admin can view any proposal
    if (role === "pmo" || role === "admin") {
      return {
        success: true,
        message: "Berhasil mendapatkan detail proposal",
        data,
      };
    }

    // Officers can only view their own proposals
    const supabase = await createClient();
    const { data: proposal, error } = await supabase
      .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
      .select("user_id")
      .eq("id", id)
      .single();

    if (error || !proposal) {
      return {
        success: false,
        message: "Proposal tidak ditemukan",
        data: null,
      };
    }

    if (proposal.user_id !== sub) {
      return {
        success: false,
        message: "Anda tidak memiliki akses ke proposal ini",
        data: null,
      };
    }

    return {
      success: true,
      message: "Berhasil mendapatkan detail proposal",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Terjadi kesalahan",
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
