import z from "zod";
import { identifyKdmpSchema } from "./forms/identify-kdmp-schema";
import { locationKdmpSchema } from "./forms/location-kdmp-schema";
import { proposalDetailSchema } from "./forms/proposal-detail-schema";

export async function createProposal(formData: FormData) {
  // Step 1: Identitas Area
  const identifyAreaObj = {
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
  const identifyResult = identifyKdmpSchema.safeParse(identifyAreaObj);

  if (!identifyResult.success) {
    return {
      success: false,
      step: 1,
      message: "Validasi gagal pada Identitas KDMP (Step 1)",
      errors: z.flattenError(identifyResult.error).fieldErrors,
    };
  }

  // Step 2: Identitas Kelompok (Informasi Wilayah KDMP)
  const privacyObj = {
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    landSlope: formData.get("landSlope"),
    province_id: formData.get("province_id"),
    regency_id: formData.get("regency_id"),
    district_id: formData.get("district_id"),
    village_id: formData.get("village_id"),
  };
  const privacyResult = locationKdmpSchema.safeParse(privacyObj);

  if (!privacyResult.success) {
    return {
      success: false,
      step: 2,
      message: "Validasi gagal pada Identitas Kelompok (Step 2)",
      errors: z.flattenError(privacyResult.error).fieldErrors,
    };
  }

  // Step 3: Detail Proposal
  const commodityPotentials = formData.getAll(
    "commodity_potentials",
  ) as string[];

  const detailObj = {
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
    documentations: JSON.parse((formData.get("documentations") as string) || "[]"),
  };
  const detailResult = proposalDetailSchema.safeParse(detailObj);

  console.log(detailResult.data?.other_commodity_potential);

  if (!detailResult.success) {
    return {
      success: false,
      step: 3,
      message: "Validasi gagal pada Detail Proposal (Step 3)",
      errors: z.flattenError(detailResult.error).fieldErrors,
    };
  }

  // --- BERHASIL ---
  // Lakukan insert database di sini menggunakan data yang sudah tervalidasi:
  // - identifyResult.data
  // - privacyResult.data
  // - detailResult.data

  return { success: true, message: "Berhasil menyimpan proposal!" };
}
