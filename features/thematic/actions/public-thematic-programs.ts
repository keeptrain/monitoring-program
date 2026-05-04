"use server";

import { createClient } from "@/utils/supabase";
import { TABLES } from "@/lib/constants/tables";

export type PublicThematicProgram = {
  id: string;
  location_id: number;
  name: string;
  progress_percent: number;
  commodity_aid: string;
  commodity_potential: string | null;
  land_area: string;
  production_value: string;
  total_management: number;
  total_members: number;
  distribution_amount: number;
  sppg_partner: string;
  s_curve_path: string;
  kusuka_number: string;
  nib: string | null;
  legal_entity_number: string | null;
  available_locations: {
    name: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
};

type PublicThematicProgramRow = {
  id: string;
  location_id: number;
  progress_percent: number;
  commodity_aid: string;
  commodity_potential: string | null;
  land_area: string;
  production_value: string;
  distribution_amount: number;
  sppg_partner: string;
  s_curve_path: string;
  kdmp_entities: {
    name: string;
    kusuka_number: string | null;
    nib: string | null;
    legal_entity_number: string | null;
    board_member_count: number | null;
    member_count: number | null;
  } | null;
  available_locations:
    | {
        name: string | null;
        latitude: number | null;
        longitude: number | null;
      }
    | Array<{
        name: string | null;
        latitude: number | null;
        longitude: number | null;
      }>
    | null;
};

export async function getPublicThematicProgram(id: string | number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .select(
      `
      id,
      location_id,
      progress_percent,
      commodity_aid,
      commodity_potential,
      land_area,
      production_value,
      distribution_amount,
      sppg_partner,
      s_curve_path,
      kdmp_entities (
        name,
        kusuka_number,
        nib,
        legal_entity_number,
        board_member_count,
        member_count
      ),
      available_locations (
        name,
        latitude,
        longitude
      )
      `,
    )
    .eq("id", id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle<PublicThematicProgramRow>();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const location = Array.isArray(data.available_locations)
    ? (data.available_locations[0] ?? null)
    : data.available_locations;

  const entity = data.kdmp_entities;

  return {
    id: data.id,
    location_id: data.location_id,
    name: entity?.name ?? "Tidak Diketahui",
    progress_percent: data.progress_percent,
    commodity_aid: data.commodity_aid,
    commodity_potential: data.commodity_potential,
    land_area: data.land_area,
    production_value: data.production_value,
    total_management: entity?.board_member_count ?? 0,
    total_members: entity?.member_count ?? 0,
    distribution_amount: data.distribution_amount,
    sppg_partner: data.sppg_partner,
    s_curve_path: data.s_curve_path,
    kusuka_number: entity?.kusuka_number ?? "",
    nib: entity?.nib ?? null,
    legal_entity_number: entity?.legal_entity_number ?? null,
    available_locations: location ?? null,
  } satisfies PublicThematicProgram;
}
