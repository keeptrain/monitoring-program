"use server";

import z from "zod";
import { createProposalWithDocumentations } from "./proposal-services";
import { identifyKdmpSchema } from "../forms/identify-kdmp-schema";
import { locationKdmpSchema } from "../forms/location-kdmp-schema";
import { proposalDetailSchema } from "../forms/proposal-detail-schema";
import { getSession } from "@/features/auth/session";

/**
 * Validasi Step 1: Identitas Area / KDMP
 */
function validateIdentifyArea(formData: FormData) {
  const data = {
    name: formData.get("name"),
    nib: formData.get("nib"),
    kusukaNumber: formData.get("kusukaNumber"),
    legalEntityNumber: formData.get("legalEntityNumber"),
    chairmanName: formData.get("chairmanName"),
    chairmanPhoneNumber: formData.get("chairmanPhoneNumber"),
    companionName: formData.get("companionName"),
    companionPhoneNumber: formData.get("companionPhoneNumber"),
    boardMemberCount: formData.get("boardMemberCount"),
    memberCount: formData.get("memberCount"),
  };
  return identifyKdmpSchema.safeParse(data);
}

/**
 * Validasi Step 2: Informasi Wilayah
 */
function validateLocation(formData: FormData) {
  const data = {
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    landSlope: formData.get("landSlope"),
    province_code: formData.get("province_code"),
    regency_code: formData.get("regency_code"),
    district_code: formData.get("district_code"),
    village_code: formData.get("village_code"),
  };
  return locationKdmpSchema.safeParse(data);
}

/**
 * Validasi Step 3: Detail Proposal
 */
function validateProposalDetail(formData: FormData) {
  const commodityPotentials = formData.getAll(
    "commodity_potentials",
  ) as string[];
  const data = {
    has_letter_of_land_preparation_and_use: formData.get(
      "has_letter_of_land_preparation_and_use",
    ),
    proposed_commodity: formData.get("proposed_commodity"),
    has_member_with_experience: formData.get("has_member_with_experience"),
    commodity_potentials: commodityPotentials,
    other_commodity_potential: commodityPotentials.includes("other")
      ? formData.get("other_commodity_potential")
      : undefined,
    proposal_path: formData.get("proposal_path"),
    documentations: JSON.parse(
      (formData.get("documentations") as string) || "[]",
    ),
  };
  return proposalDetailSchema.safeParse(data);
}

export async function createProposal(formData: FormData) {
  const { sub, isLoggedIn, role } = await getSession();

  if (!isLoggedIn || role !== "officer") {
    return {
      success: false,
      message: "Anda harus login untuk membuat proposal",
      step: 1,
      errors: null,
    };
  }

  // Step 1: Identitas Area
  const identifyResult = validateIdentifyArea(formData);
  if (!identifyResult.success) {
    return {
      success: false,
      step: 1,
      message: "Validasi gagal pada Identitas KDMP (Step 1)",
      errors: z.flattenError(identifyResult.error).fieldErrors,
    };
  }

  // Step 2: Informasi Wilayah
  const locationResult = validateLocation(formData);
  if (!locationResult.success) {
    return {
      success: false,
      step: 2,
      message: "Validasi gagal pada Informasi Wilayah (Step 2)",
      errors: z.flattenError(locationResult.error).fieldErrors,
    };
  }

  // Step 3: Detail Proposal
  const detailResult = validateProposalDetail(formData);
  if (!detailResult.success) {
    return {
      success: false,
      step: 3,
      message: "Validasi gagal pada Detail Proposal (Step 3)",
      errors: z.flattenError(detailResult.error).fieldErrors,
    };
  }

  // Insert to db
  const result = await createProposalWithDocumentations(
    sub,
    identifyResult.data,
    locationResult.data,
    detailResult.data,
  );

  if (!result.success) {
    return {
      ...result,
      step: 3,
      errors: null,
    };
  }

  return { success: true, message: "Berhasil mengajukan proposal!" };
}
