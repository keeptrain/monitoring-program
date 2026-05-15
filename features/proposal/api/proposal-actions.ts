"use server";

import z from "zod";
import {
  createProposalWithDocumentations,
  updateProposalWithDocumentations,
} from "./proposal-services";
import {
  proposalIdentitySchema,
  ProposalIdentityFormValues,
} from "../forms/proposal-identity-schema";
import {
  proposalLocationSchema,
  ProposalLocationValues,
} from "../forms/proposal-location-schema";
import {
  proposalDetailSchema,
  ProposalDetailFormValues,
} from "../forms/proposal-detail-schema";
import { getSession } from "@/features/auth/session";
import { createClient } from "@/utils/supabase";
import { TABLES } from "@/lib/constants/tables";
import { redirect } from "next/navigation";

/**
 * Validasi Step 1: Identitas
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
  return proposalIdentitySchema.safeParse(data);
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
  return proposalLocationSchema.safeParse(data);
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
  const { sub, isLoggedIn, role, programScope } = await getSession();

  if (!isLoggedIn || role !== "officer") {
    return {
      success: false,
      message: "Anda harus login untuk membuat proposal",
      step: 1,
      errors: null,
    };
  }

  // Step 1: Identitas
  const identifyResult = validateIdentifyArea(formData);
  if (!identifyResult.success) {
    return {
      success: false,
      step: 1,
      message: "Validasi gagal pada Identitas (Step 1)",
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

  const programType = programScope?.includes("minapadi")
    ? "minapadi_thematic"
    : "biofloc_thematic";

  // Insert to db
  const result = await createProposalWithDocumentations(
    sub,
    identifyResult.data,
    locationResult.data,
    detailResult.data,
    programType,
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

export interface RevisionProposalData {
  revisionReason: string | null;
  step1Data: ProposalIdentityFormValues;
  step2Data: ProposalLocationValues;
  step3Data: ProposalDetailFormValues;
}

export async function getRevisionProposal(id: string) {
  const { sub, isLoggedIn, role, programScope } = await getSession();

  if (!isLoggedIn || role !== "officer") {
    return {
      success: false,
      message: "Unauthorized",
      step: 1,
      errors: null,
    };
  }

  const programType = programScope?.includes("minapadi")
    ? "minapadi_thematic"
    : "biofloc_thematic";
  const targetTable =
    programType === "minapadi_thematic"
      ? TABLES.PROPOSAL_MINAPADI_THEMATIC_PROGRAMS
      : TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS;
  const docType =
    programType === "minapadi_thematic"
      ? "proposal_minapadi_thematic"
      : "proposal_biofloc_thematic";
  const basePath =
    programType === "minapadi_thematic"
      ? "/minapadi-thematic"
      : "/biofloc-thematic";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(targetTable)
    .select(
      `
      *,
      kdmp_entities (*),
      available_locations (*)
    `,
    )
    .eq("user_id", sub)
    .eq("status", "rejected")
    .eq("id", id)
    .single();

  if (error) {
    return {
      success: false,
      message: "Gagal mendapatkan proposal",
      step: 1,
      errors: null,
    };
  }

  if (!data || data.status !== "rejected") {
    redirect(basePath);
  }

  // Fetch documentations separately (Polymorphic relationship)
  const { data: documentations } = await supabase
    .from("documentations")
    .select("*")
    .eq("program_id", id)
    .eq("program_type", docType);

  // Group documentations by group_id
  const documentationGroups: Record<string, any> = {};
  documentations?.forEach((doc: any) => {
    if (!documentationGroups[doc.group_id]) {
      documentationGroups[doc.group_id] = {
        image_before_paths: [],
        image_after_paths: [],
      };
    }

    const docItem = {
      path: doc.path,
      file_name: doc.file_name,
    };

    if (doc.type === "before" || doc.type === "proposal_before") {
      documentationGroups[doc.group_id].image_before_paths.push(docItem);
    } else if (doc.type === "after") {
      documentationGroups[doc.group_id].image_after_paths.push(docItem);
    }
  });

  const formattedDocumentations = Object.values(documentationGroups);

  // Map to store structure
  const formattedData: RevisionProposalData = {
    revisionReason: data.rejection_reason,
    step1Data: {
      name: data.kdmp_entities.name,
      nib: data.kdmp_entities.nib,
      kusukaNumber: data.kdmp_entities.kusuka_number,
      legalEntityNumber: data.kdmp_entities.legal_entity_number,
      chairmanName: data.kdmp_entities.chairman_name,
      chairmanPhoneNumber: data.kdmp_entities.chairman_phone,
      companionName: data.kdmp_entities.companion_name,
      companionPhoneNumber: data.kdmp_entities.companion_phone,
      boardMemberCount: data.kdmp_entities.board_member_count,
      memberCount: data.kdmp_entities.member_count,
    },
    step2Data: {
      province_code: data.available_locations.province_code,
      regency_code: data.available_locations.regency_code,
      district_code: data.available_locations.district_code,
      village_code: data.available_locations.village_code,
      latitude: data.available_locations.latitude,
      longitude: data.available_locations.longitude,
      landSlope: Number(data.land_slope),
    },
    step3Data: {
      has_letter_of_land_preparation_and_use: String(
        data.has_land_preparation_letter,
      ) as "true" | "false",
      proposed_commodity: data.proposed_commodity as "lele" | "nila",
      has_member_with_experience: String(data.has_experienced_member) as
        | "true"
        | "false",
      commodity_potentials: data.commodity_potentials,
      other_commodity_potential: data.other_commodity_potential || undefined,
      proposal_path: data.proposal_path,
      documentations: formattedDocumentations.length
        ? (formattedDocumentations as any)
        : [{ image_before_paths: [], image_after_paths: [] }],
    },
  };

  return {
    success: true,
    data: formattedData,
    message: "Berhasil mendapatkan proposal!",
  };
}

export async function updateRevisionProposal(id: string, formData: FormData) {
  const { sub, isLoggedIn, role, programScope } = await getSession();

  if (!isLoggedIn || role !== "officer") {
    return {
      success: false,
      message: "Unauthorized",
      step: 1,
      errors: null,
    };
  }

  // Step 1: Identitas
  const identifyResult = validateIdentifyArea(formData);
  if (!identifyResult.success) {
    return {
      success: false,
      step: 1,
      message: "Validasi gagal pada Identitas (Step 1)",
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

  const programType = programScope?.includes("minapadi")
    ? "minapadi_thematic"
    : "biofloc_thematic";

  // Update existing proposal
  const result = await updateProposalWithDocumentations(
    id,
    sub,
    identifyResult.data,
    locationResult.data,
    detailResult.data,
    programType,
  );

  if (!result.success) {
    return {
      ...result,
      step: 3,
      errors: null,
    };
  }

  return { success: true, message: "Berhasil merevisi proposal!" };
}
