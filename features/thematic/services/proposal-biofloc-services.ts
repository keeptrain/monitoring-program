import { TABLES } from "@/lib/constants/tables";
import { createClient } from "@/utils/supabase";
import { ProposalBioflocFormValues } from "../forms/proposal-biofloc-schema";
import { SupabaseClient } from "@supabase/supabase-js";

export type ProposalBioflocThematicProgram = {
  id: number;
  status: string;
  name: string;
  province: string;
  regency: string;
  district: string;
  village: string;
  location_id: number | null;
  proposal_path: string;
  created_at: string;
  updated_at: string;
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

export async function createAvailableLocationForBioflocProposalService(
  supabase: SupabaseClient,
  payload: ProposalBioflocFormValues,
) {
  const { data: location, error } = await supabase
    .from(TABLES.AVAILABLE_LOCATIONS)
    .insert({
      type: "biofloc_thematic",
      name: payload.name,
      latitude: payload.latitude,
      longitude: payload.longitude,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Gagal menyimpan lokasi: ${error.message}`);
  }

  return location;
}

export async function createProposalBioflocThematicProgramService(
  payload: ProposalBioflocFormValues,
) {
  const supabase = await createClient();
  const locationId = await createAvailableLocationForBioflocProposalService(
    supabase,
    payload,
  );

  const { data, error } = await supabase
    .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
    .insert({
      name: payload.name,
      province: payload.province,
      regency: payload.regency,
      district: payload.district,
      village: payload.village,
      location_id: locationId.id,
      proposal_path: payload.proposal_path,
      status: "Pending",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Gagal menyimpan proposal: ${error.message}`);
  }

  return data as ProposalBioflocThematicProgram;
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
    .select("*", { count: "exact" });

  // Optimized search: use the name_search (lowercase) generated column
  if (search && search.trim().length > 0) {
    query = query.ilike("name_search", `%${search.trim().toLowerCase()}%`);
  }

  // Province filter
  if (province && province.trim().length > 0) {
    query = query.eq("province", province);
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
  const { count, error } = await supabase
    .from(TABLES.PROPOSAL_BIOFLOC_THEMATIC_PROGRAMS)
    .select("id", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return count ?? 0;
}

/** Update proposal status (admin action) */
export async function updateProposalStatusService(
  id: number,
  status: "Disetujui" | "Ditolak",
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
