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
import { BioflocProgramFormValues } from "../forms/biofloc-program-schema";
import { ProposalVerificationFormValues } from "../forms/proposal-verification-schema";

function normalizeProvinceName(province: string): string {
  return province.trim().toLowerCase();
}

/**
 * Server-paginated fetch with search (using name_search lowercase column)
 * and province filter. Reusable for both public and admin views.
 */
export async function getProposalBioflocPaginatedService(
  params: ProposalBioflocPaginationParams,
  userId?: string,
): Promise<PaginatedProposalBioflocResult> {
  const supabase = await createClient();

  const { page, pageSize, search, province } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS).select(
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

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
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

/** Simple: get all (legacy, for backward compat) */
export async function getProposalBioflocThematicProgramsService() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as ProposalBioflocThematicProgram[];
}

export async function getProposalBioflocTotal(
  supabase: SupabaseClient,
): Promise<number> {
  const summary = await getProposalBioflocProvinceSummary(supabase);
  return summary.proposal_total;
}

export async function getProposalBioflocProvinceSummary(
  supabase: SupabaseClient,
): Promise<ProposalBioflocProvinceSummary> {
  const { data, error } = await supabase.from(
    TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS,
  ).select(`
      available_locations!inner(
        ref_provinces!inner(
          name
        )
      )
    `);

  if (error) {
    throw error;
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

/** Update proposal status (admin action) with smart metadata handling */
export async function verifyProposalBioflocService(
  id: string,
  verifierId: string,
  data: ProposalVerificationFormValues,
) {
  const supabase = await createClient();

  // Get current data proposal
  const { data: existingProposal, error: errorExistingProposal } =
    await supabase
      .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
      .select("reviewed_at, rejection_reason")
      .eq("id", id)
      .single();

  if (errorExistingProposal || !existingProposal) {
    return { success: false, message: "Proposal tidak ditemukan" };
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

  const { error } = await supabase
    .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
    .update(updatePayload)
    .eq("id", id);

  if (error) {
    console.error("Error update proposal status:", error);
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: "Verifikasi proposal berhasil disimpan",
  };
}

export async function createSignedUrl(id: string) {
  const supabase = await createClient();
  const { data: proposalBiofloc, error: proposalBioflocError } = await supabase
    .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
    .select("proposal_path")
    .eq("id", id)
    .single();

  if (proposalBioflocError) {
    throw new Error(
      `Error failed signed url for proposal biofloc: ${proposalBioflocError.message}`,
    );
  }

  if (!proposalBiofloc?.proposal_path) {
    throw new Error("Proposal tidak ditemukan.");
  }

  const { data: blob, error } = await supabase.storage
    .from("demo")
    .download(proposalBiofloc.proposal_path);

  if (error) {
    throw new Error(
      `Error failed signed url for proposal biofloc: ${error.message}`,
    );
  }

  return { blob, originalPath: proposalBiofloc.proposal_path };
}

/**
 * Get single proposal detail with location info (lat/lng)
 */
export async function getProposalBioflocDetailService(
  id: string,
): Promise<ProposalBioflocDetail> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
    .select(
      `
      id,
      status,
      entity_id,
      location_id,
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
    throw error;
  }

  if (!data) {
    throw new Error("Proposal tidak ditemukan.");
  }

  return data as unknown as ProposalBioflocDetail;
}

/**
 * Convert an approved proposal into a thematic program (KDMP)
 * This creates a new thematic program using the proposal data
 */
export async function convertProposalToThematicProgramService(
  proposalId: string,
  value: BioflocProgramFormValues,
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  // Get the approved proposal with relationship IDs
  const { data: proposal, error: proposalError } = await supabase
    .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
    .select("id, entity_id, location_id, status")
    .eq("id", proposalId)
    .single();

  if (proposalError || !proposal) {
    throw new Error(
      "Proposal tidak ditemukan atau belum disetujui untuk dikonversi.",
    );
  }

  if (proposal.status !== "approved") {
    throw new Error("Proposal belum di setujui.");
  }

  // Create new thematic program with normalized references
  const { error: bioflocInsertError } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .insert({
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
      // address: value.address, // Now comes from form or entity
      s_curve_path: value.s_curve_path,
      fiscal_year: new Date().getFullYear(),
    });

  if (bioflocInsertError) {
    throw new Error(
      `Gagal membuat program tematik: ${bioflocInsertError.message}`,
    );
  }

  const { error: updateProposalError } = await supabase
    .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
    .update({ status: "converted" })
    .eq("id", proposalId);

  if (updateProposalError) {
    throw new Error(
      `Gagal memperbarui status proposal: ${updateProposalError.message}`,
    );
  }

  return {
    success: true,
    message: `Program tematik berhasil dibuat dari proposal.`,
  };
}
