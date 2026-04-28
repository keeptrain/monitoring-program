import { TABLES } from "@/lib/constants/tables";
import { createClient } from "@/utils/supabase";
import { ProposalBioflocFormValues } from "../forms/proposal-biofloc-schema";
import { SupabaseClient } from "@supabase/supabase-js";
import { ProposalBioflocStatus } from "../types/thematic";
import { INDONESIA_PROVINCES } from "../constants/indonesia-provinces";
import { BioflocProgramFormValues } from "../forms/biofloc-program-schema";

export type ProposalBioflocThematicProgram = {
  id: number;
  status: ProposalBioflocStatus;
  name: string;
  province_id: string;
  regency_id: string;
  district: string;
  village: string;
  location_id: number | null;
  proposal_path: string;
  created_at: string;
  updated_at: string;
};

export type ProposalBioflocDetail = ProposalBioflocThematicProgram & {
  available_locations: {
    latitude: number;
    longitude: number;
  } | null;
};

export type ProposalBioflocPaginationParams = {
  page: number;
  pageSize: number;
  search?: string;
  province?: string;
};

export type PaginatedProposalBioflocResult = {
  data: ProposalBioflocThematicProgram[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type ProposalProvinceRow = {
  province_id: string | null;
};

export type ProposalBioflocProvinceSummary = {
  proposal_total: number;
  proposal_count_by_province: Record<string, number>;
};

function normalizeProvinceName(province: string): string {
  return province.trim().toLowerCase();
}

export async function createAvailableLocationForBioflocProposalService(
  supabase: SupabaseClient,
  payload: ProposalBioflocFormValues,
) {
  const { data: locationId, error } = await supabase
    .from(TABLES.AVAILABLE_LOCATIONS)
    .insert({
      type: "biofloc_thematic",
      province_id: payload.province_id,
      regency_id: payload.regency_id,
      name: payload.name,
      latitude: payload.latitude,
      longitude: payload.longitude,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Gagal menyimpan lokasi: ${error.message}`);
  }

  return locationId;
}

export async function createProposalBioflocThematicProgramService(
  payload: ProposalBioflocFormValues,
) {
  const supabase = await createClient();
  const locationId = await createAvailableLocationForBioflocProposalService(
    supabase,
    payload,
  );

  const { error } = await supabase
    .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
    .insert({
      location_id: locationId.id,
      status: "pending",
      name: payload.name,
      province_id: payload.province_id,
      regency_id: payload.regency_id,
      district: payload.district,
      village: payload.village,
      proposal_path: payload.proposal_path,
    });

  if (error) {
    throw new Error(`Gagal menyimpan proposal: ${error.message}`);
  }

  return { message: "Proposal berhasil diajukan." };
}

/**
 * Server-paginated fetch with search (using name_search lowercase column)
 * and province filter. Reusable for both public and admin views.
 */
export async function getProposalBioflocPaginatedService(
  params: ProposalBioflocPaginationParams,
): Promise<PaginatedProposalBioflocResult> {
  const supabase = await createClient();

  const { page, pageSize, search, province } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
    .select(
      "id, name, province_id, regency_id, district, village, status, created_at",
      { count: "exact" },
    );

  // Optimized search: use the name_search (lowercase) generated column
  if (search && search.trim().length > 0) {
    query = query.like("name_search", `%${search.trim().toLowerCase()}%`);
  }

  // Province filter
  if (province && province.trim().length > 0) {
    query = query.eq("province_id", province);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  const total = count ?? 0;

  return {
    data: (data ?? []) as ProposalBioflocThematicProgram[],
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
  const { data, error } = await supabase
    .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
    .select("province_id");

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as ProposalProvinceRow[];
  const proposal_count_by_province = rows.reduce<Record<string, number>>(
    (acc, row) => {
      if (!row.province_id) {
        return acc;
      }
      const province =
        INDONESIA_PROVINCES.find((p) => p.province_id === row.province_id)
          ?.name ?? row.province_id;
      const key = normalizeProvinceName(province);
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

/** Update proposal status (admin action) */
export async function updateProposalStatusService(
  id: number,
  status: ProposalBioflocStatus,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Gagal memperbarui status: ${error.message}`);
  }

  return data as ProposalBioflocThematicProgram;
}

export async function createSignedUrl(id: number) {
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
  id: number,
): Promise<ProposalBioflocDetail> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
    .select(
      `
      id,
      status,
      name,
      province_id,
      regency_id,
      district,
      village,
      location_id,
      proposal_path,
      created_at,
      updated_at,
      available_locations (
        name,
        latitude,
        longitude
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
  proposalId: number,
  value: BioflocProgramFormValues,
): Promise<{ message: string }> {
  const supabase = await createClient();

  // Get the approved proposal with location details
  const { data: proposal, error: proposalError } = await supabase
    .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
    .select("id, location_id, name, district, village")
    .eq("id", proposalId)
    .single();

  if (proposalError || !proposal) {
    throw new Error(
      "Proposal tidak ditemukan atau belum disetujui untuk dikonversi.",
    );
  }

  // Create new thematic program with proposal data
  const { error: programError } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .insert({
      proposal_id: proposalId,
      location_id: proposal.location_id,
      name: proposal.name,
      status: "potential",
      kusuka_number: "",
      commodity_aid: value.commodity_aid,
      commodity_potential: value.commodity_potential,
      land_area: value.land_area,
      production_value: value.production_value,
      total_management: value.total_management,
      total_members: value.total_members,
      distribution_amount: value.distribution_amount,
      sppg_partner: value.sppg_partner,
      address: `${proposal.village}, ${proposal.district}`,
      s_curve_path: value.s_curve_path,
      progress_percent: value.progress_percent,
    });

  if (programError) {
    throw new Error(`Gagal membuat program tematik: ${programError.message}`);
  }

  return {
    message: `Program tematik berhasil dibuat dari proposal.`,
  };
}
