"use server";

import { uuidv7 } from "uuidv7";
import { createClient } from "@/utils/supabase";
import { IdentifyKdmpFormValues } from "../forms/identify-kdmp-schema";
import { LocationKdmpValues } from "../forms/location-kdmp-schema";
import { ProposalDetailFormValues } from "../forms/proposal-detail-schema";
import { TABLES } from "@/lib/constants/tables";
import {
  saveDocumentationsAction,
  upsertDocumentations,
} from "@/features/documentation/actions";

export async function createProposalWithDocumentations(
  userId: string,
  identify: IdentifyKdmpFormValues,
  location: LocationKdmpValues,
  detail: ProposalDetailFormValues,
  programType: string,
) {
  const targetTable =
    programType === "minapadi_thematic"
      ? TABLES.PROPOSAL_MINAPADI_THEMATIC_PROGRAMS
      : TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS;
  const docType =
    programType === "minapadi_thematic"
      ? "proposal_minapadi_thematic"
      : "proposal_biofloc_thematic";
  const supabase = await createClient();
  const proposalId = uuidv7();
  const fiscalYear = 2026;

  // 1. Insert KDMP Entity
  const { data: kdmpData, error: kdmpError } = await supabase
    .from(TABLES.KDMP_ENTITIES)
    .insert({
      name: identify.name,
      kusuka_number: identify.kusukaNumber,
      nib: identify.nib,
      legal_entity_number: identify.legalEntityNumber,
      chairman_name: identify.chairmanName,
      chairman_phone: identify.chairmanPhoneNumber,
      companion_name: identify.companionName,
      companion_phone: identify.companionPhoneNumber,
      board_member_count: identify.boardMemberCount,
      member_count: identify.memberCount,
    })
    .select("id")
    .single();

  if (kdmpError) {
    console.error("KDMP Insert Error:", kdmpError);
    return {
      success: false,
      message: "Gagal menyimpan data KDMP: " + kdmpError.message,
    };
  }

  if (!kdmpData) {
    return {
      success: false,
      message: "KDMP data tidak ditemukan setelah insert",
    };
  }

  // 2. Insert Location to available_locations
  const { data: locationData, error: locationError } = await supabase
    .from(TABLES.AVAILABLE_LOCATIONS)
    .insert({
      name: identify.name,
      province_code: location.province_code,
      province_name: location.province_name || "Provinsi",
      regency_code: location.regency_code,
      district_code: location.district_code,
      village_code: location.village_code,
      latitude: location.latitude,
      longitude: location.longitude,
      type: programType,
    })
    .select("id")
    .single();

  if (locationError) {
    console.error("Location Insert Error:", locationError);
    return {
      success: false,
      message: "Gagal menyimpan data lokasi: " + locationError.message,
    };
  }

  if (!locationData) {
    return {
      success: false,
      message: "Location data tidak ditemukan setelah insert",
    };
  }

  // 3. Insert Proposal
  const { error: proposalError } = await supabase.from(targetTable).insert({
    id: proposalId,
    entity_id: kdmpData.id,
    location_id: locationData.id,
    user_id: userId,
    status: "pending",
    land_slope: location.landSlope,
    has_land_preparation_letter: detail.has_letter_of_land_preparation_and_use,
    proposed_commodity: detail.proposed_commodity,
    has_experienced_member: detail.has_member_with_experience,
    commodity_potentials: detail.commodity_potentials,
    other_commodity_potential: detail.other_commodity_potential || null,
    proposal_path: detail.proposal_path,
    fiscal_year: fiscalYear,
  });

  if (proposalError) {
    console.error("Proposal Insert Error:", proposalError);
    return {
      success: false,
      message: "Gagal menyimpan proposal: " + proposalError.message,
    };
  }

  // 4. Insert Documentations
  const docsResult = await saveDocumentationsAction(
    supabase,
    proposalId,
    docType,
    detail.documentations,
  );

  if (!docsResult.success) {
    // We don't throw here to allow the proposal to remain, but we inform the user
    console.error("Documentation Error:", docsResult.error);
  }

  return {
    success: true,
    message: "Proposal berhasil dibuat",
    proposalId,
    kdmpId: kdmpData.id,
  };
}

export async function updateProposalWithDocumentations(
  proposalId: string,
  userId: string,
  identify: IdentifyKdmpFormValues,
  location: LocationKdmpValues,
  detail: ProposalDetailFormValues,
  programType: string,
) {
  const targetTable =
    programType === "minapadi_thematic"
      ? TABLES.PROPOSAL_MINAPADI_THEMATIC_PROGRAMS
      : TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS;
  const docType =
    programType === "minapadi_thematic"
      ? "proposal_minapadi_thematic"
      : "proposal_biofloc_thematic";
  const supabase = await createClient();

  // 1. Fetch existing proposal
  const { data: existingProposal, error: fetchError } = await supabase
    .from(targetTable)
    .select("entity_id, location_id, rejection_reason")
    .eq("id", proposalId)
    .eq("user_id", userId)
    .eq("status", "rejected")
    .single();

  if (fetchError || !existingProposal) {
    console.error("Fetch Proposal Error:", fetchError);
    return {
      success: false,
      message: "Proposal tidak ditemukan atau tidak dapat direvisi",
    };
  }

  // 2. Update KDMP Entity
  const { error: kdmpError } = await supabase
    .from(TABLES.KDMP_ENTITIES)
    .update({
      name: identify.name,
      kusuka_number: identify.kusukaNumber,
      nib: identify.nib,
      legal_entity_number: identify.legalEntityNumber,
      chairman_name: identify.chairmanName,
      chairman_phone: identify.chairmanPhoneNumber,
      companion_name: identify.companionName,
      companion_phone: identify.companionPhoneNumber,
      board_member_count: identify.boardMemberCount,
      member_count: identify.memberCount,
    })
    .eq("id", existingProposal.entity_id);

  if (kdmpError) {
    console.error("KDMP Update Error:", kdmpError);
    return {
      success: false,
      message: "Gagal memperbarui data KDMP: " + kdmpError.message,
    };
  }

  // 3. Update Location
  const { error: locationError } = await supabase
    .from(TABLES.AVAILABLE_LOCATIONS)
    .update({
      name: identify.name,
      province_code: location.province_code,
      province_name: location.province_name || "Provinsi",
      regency_code: location.regency_code,
      district_code: location.district_code,
      village_code: location.village_code,
      latitude: location.latitude,
      longitude: location.longitude,
    })
    .eq("id", existingProposal.location_id);

  if (locationError) {
    console.error("Location Update Error:", locationError);
    return {
      success: false,
      message: "Gagal memperbarui data lokasi: " + locationError.message,
    };
  }

  // 4. Update Proposal — preserve rejection_reason for audit trail
  const { error: proposalError } = await supabase
    .from(targetTable)
    .update({
      status: "pending",
      land_slope: location.landSlope,
      has_land_preparation_letter:
        detail.has_letter_of_land_preparation_and_use,
      proposed_commodity: detail.proposed_commodity,
      has_experienced_member: detail.has_member_with_experience,
      commodity_potentials: detail.commodity_potentials,
      other_commodity_potential: detail.other_commodity_potential || null,
      proposal_path: detail.proposal_path,
      rejection_reason: existingProposal.rejection_reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", proposalId);

  if (proposalError) {
    console.error("Proposal Update Error:", proposalError);
    return {
      success: false,
      message: "Gagal memperbarui proposal: " + proposalError.message,
    };
  }

  // 5. Upsert Documentations (delete old + insert new)
  const docsResult = await upsertDocumentations(
    proposalId,
    docType,
    detail.documentations,
  );

  if (!docsResult.success) {
    console.error("Documentation Error:", docsResult.message);
  }

  return {
    success: true,
    message: "Proposal berhasil direvisi",
    proposalId,
  };
}
