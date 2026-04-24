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

export async function createAvailableLocationForBioflocProposalService(
  supabase: SupabaseClient,
  payload: ProposalBioflocFormValues,
) {
  const { data: location, error } = await supabase
    .from("available_locations")
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
