import { TABLES } from "@/lib/constants/tables";
import { createClient } from "@/utils/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  ProposalBioflocThematicProgram,
  ProposalBioflocDetail,
  ProposalBioflocPaginationParams,
  PaginatedProposalBioflocResult,
  ProposalBioflocProvinceSummary,
} from "@/features/proposal/types/proposal-biofloc";
import { ProposalVerificationFormValues } from "../forms/proposal-verification-schema";
import { ThematicProgramFormValues } from "../forms/thematic-program-schema";
import { uuidv7 } from "uuidv7";
import { ThematicMetadata } from "../constants/thematic-constants";

function normalizeProvinceName(province: string): string {
  return province.trim().toLowerCase();
}

/**
 * Server-paginated fetch with search (using name_search lowercase column)
 * and province filter. Reusable for both public and admin views.
 */
export async function getProposalThematicPaginatedService(
  params: ProposalBioflocPaginationParams,
  userId?: string,
): Promise<PaginatedProposalBioflocResult> {
  const supabase = await createClient();

  const { page, pageSize, search, province, status } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const targetTable =
    params.programType === "minapadi_thematic"
      ? TABLES.PROPOSAL_MINAPADI_THEMATIC_PROGRAMS
      : TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS;

  let query = supabase.from(targetTable).select(
    `
      id, 
      status, 
      entity_id,
      location_id,
      proposed_commodity,
      commodity_potentials,
      rejection_reason,
      created_at,
      kdmp_entities!inner (name, name_search),
      available_locations!inner (
        province_code, 
        village_code,
        ref_villages (name)
      )
      `,
    { count: "exact" },
  );

  if (userId !== undefined) {
    query = query.eq("user_id", userId);
  }

  if (search && search.trim().length > 0) {
    // Optimized search: use prefix search to leverage B-tree index
    query = query.like(
      "kdmp_entities.name_search",
      `${search.trim().toLowerCase()}%`,
    );
  }

  // Province filter (now using province_code from available_locations)
  if (province && province.trim().length > 0) {
    query = query.eq("available_locations.province_code", province);
  }

  if (status && status.trim().length > 0) {
    query = query.eq("status", status.trim());
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error("Failed to fetch proposals");
  }

  const total = count ?? 0;

  return {
    data: (data ?? []) as unknown as ProposalBioflocThematicProgram[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getProposalBioflocProvinceSummary(
  supabase: SupabaseClient,
  programType?: string,
): Promise<ProposalBioflocProvinceSummary> {
  const table =
    programType === "minapadi_thematic" || programType === "minapadi"
      ? TABLES.PROPOSAL_MINAPADI_THEMATIC_PROGRAMS
      : TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS;

  const { data, error } = await supabase.from(table).select(`
      available_locations!inner(
        ref_provinces!inner(
          name
        )
      )
    `);

  if (error) {
    throw new Error("Failed to fetch province summary");
  }

  // Define the expected shape of the response
  type JoinedRow = {
    available_locations: {
      ref_provinces: {
        name: string;
      };
    };
  };

  const rows = (data ?? []) as unknown as JoinedRow[];
  const proposal_count_by_province = rows.reduce<Record<string, number>>(
    (acc, row) => {
      const provinceName = row.available_locations?.ref_provinces?.name;
      if (!provinceName) {
        return acc;
      }
      const key = normalizeProvinceName(provinceName);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return {
    proposal_total: rows.length,
    proposal_count_by_province,
  };
}

/** Update proposal status
 * PMO Action
 * with smart metadata handling
 */
export async function verifyProposalThematicService(
  id: string,
  verifierId: string,
  data: ProposalVerificationFormValues,
  thematicMetadata: ThematicMetadata,
): Promise<void> {
  const supabase = await createClient();

  // Get current data proposal
  const { data: existingProposal, error: errorExistingProposal } =
    await supabase
      .from(thematicMetadata.proposalTable)
      .select("reviewed_at, rejection_reason")
      .eq("id", id)
      .single();

  if (errorExistingProposal) {
    if (errorExistingProposal.code === "PGRST116") {
      throw new Error("Proposal not found");
    }
    throw new Error(
      `Failed to retrieve proposal: ${errorExistingProposal.message}`,
    );
  }

  if (!existingProposal) {
    throw new Error("Proposal not found");
  }

  const now = new Date().toISOString();

  // 2. Siapkan payload update
  const updatePayload: {
    status: string;
    rejection_reason: string | null;
    reviewed_by: string;
    reviewed_at: string;
  } = {
    status: data.status,
    // If approved, remove rejection reason.
    // If rejected again, use new rejection reason (or keep old one if new one is empty)
    rejection_reason:
      data.status === "approved"
        ? null
        : (data.rejectionReason ?? existingProposal.rejection_reason),
    reviewed_by: verifierId,
    reviewed_at: now,
  };

  const { error: errorUpdateProposal } = await supabase
    .from(thematicMetadata.proposalTable)
    .update(updatePayload)
    .eq("id", id);

  if (errorUpdateProposal) {
    console.error("Error update proposal status:", errorUpdateProposal);
    throw new Error(errorUpdateProposal.message);
  }
}

export async function getProposalThematicFileService(
  id: string,
  targetTable: string,
) {
  const supabase = await createClient();

  const { data: proposal, error: proposalError } = await supabase
    .from(targetTable)
    .select("proposal_path")
    .eq("id", id)
    .single();

  if (proposalError) {
    throw new Error(
      `Failed to retrieve proposal record: ${proposalError.message}`,
    );
  }

  if (!proposal?.proposal_path) {
    throw new Error("The requested proposal document path could not be found.");
  }

  const { data: blob, error: downloadError } = await supabase.storage
    .from("demo")
    .download(proposal.proposal_path);

  if (downloadError) {
    throw new Error(
      `Failed to download the document from storage: ${downloadError.message}`,
    );
  }

  if (!blob || blob.size === 0) {
    throw new Error(
      "The downloaded document appears to be empty or corrupted.",
    );
  }

  return { blob, originalPath: proposal.proposal_path };
}

/**
 * Get single proposal detail with location info (lat/lng)
 */
export async function getProposalThematicService(
  id: string,
  targetTable: string,
): Promise<ProposalBioflocDetail> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(targetTable)
    .select(
      `
      id,
      user_id,
      entity_id,
      location_id,
      status,
      land_slope,
      has_land_preparation_letter,
      proposed_commodity,
      has_experienced_member,
      commodity_potentials,
      other_commodity_potential,
      fiscal_year,
      proposal_path,
      created_at,
      updated_at,
      kdmp_entities (
        name,
        kusuka_number,
        nib,
        legal_entity_number,
        chairman_name,
        chairman_phone,
        board_member_count,
        member_count
      ),
      available_locations (
        province_name,
        regency_code,
        district_code,
        village_code,
        latitude,
        longitude,
        ref_provinces (name),
        ref_regencies (name),
        ref_districts (name),
        ref_villages (name)
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Failed to fetch proposal thematic detail");
  }

  if (!data) {
    throw new Error("Proposal thematic not found");
  }

  return data as unknown as ProposalBioflocDetail;
}

/**
 * Convert an approved proposal into a thematic program (KDMP)
 * This creates a new thematic program using the proposal data
 */
export async function convertProposalToThematicProgramService(
  proposalId: string,
  value: ThematicProgramFormValues,
  thematicConfig: ThematicMetadata,
): Promise<void> {
  const supabase = await createClient();

  // Get the approved proposal with relationship IDs
  const { data: proposal, error: proposalError } = await supabase
    .from(thematicConfig.proposalTable)
    .select("id, entity_id, location_id, status")
    .eq("id", proposalId)
    .single();

  if (proposalError || !proposal) {
    throw new Error(
      "Proposal not found or has not been approved for conversion.",
    );
  }

  if (proposal.status !== "approved") {
    throw new Error("Proposal has not been approved.");
  }

  // Fetch location name for address
  const { data: locationData, error: locationError } = await supabase
    .from(TABLES.AVAILABLE_LOCATIONS)
    .select("name")
    .eq("id", proposal.location_id)
    .single();

  if (locationError) {
    throw new Error(
      "Failed to retrieve location data: " + locationError.message,
    );
  }

  // Create new thematic program with normalized references
  const { error: bioflocInsertError } = await supabase
    .from(thematicConfig.programTable)
    .insert({
      id: uuidv7(),
      proposal_id: proposalId,
      entity_id: proposal.entity_id,
      location_id: proposal.location_id,
      status: "potential",
      progress_percent: value.progress_percent,
      commodity_aid: value.commodity_aid,
      commodity_potential: value.commodity_potential,
      land_area: value.land_area,
      production_value: value.production_value,
      distribution_amount: value.distribution_amount,
      sppg_partner: value.sppg_partner,
      address: locationData?.name || "Unknown address",
      s_curve_path: value.s_curve_path,
      fiscal_year: new Date().getFullYear(),
    });

  if (bioflocInsertError) {
    throw new Error(
      `Failed to create thematic program: ${bioflocInsertError.message}`,
    );
  }

  const { error: updateProposalError } = await supabase
    .from(thematicConfig.proposalTable)
    .update({ status: "converted" })
    .eq("id", proposalId);

  if (updateProposalError) {
    throw new Error(
      `Failed to update proposal status: ${updateProposalError.message}`,
    );
  }
}
