"use server";

import { createClient } from "@/utils/supabase";
import { TABLES } from "@/lib/constants/tables";

export type PublicThematicProgram = {
  id: number;
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
  available_locations: {
    name: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
};

type PublicThematicProgramRow = {
  id: number;
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

export async function getPublicThematicProgram(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .select(
      `
      id,
      location_id,
      name,
      progress_percent,
      commodity_aid,
      commodity_potential,
      land_area,
      production_value,
      total_management,
      total_members,
      distribution_amount,
      sppg_partner,
      s_curve_path,
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

  return {
    id: data.id,
    location_id: data.location_id,
    name: data.name,
    progress_percent: data.progress_percent,
    commodity_aid: data.commodity_aid,
    commodity_potential: data.commodity_potential,
    land_area: data.land_area,
    production_value: data.production_value,
    total_management: data.total_management,
    total_members: data.total_members,
    distribution_amount: data.distribution_amount,
    sppg_partner: data.sppg_partner,
    s_curve_path: data.s_curve_path,
    available_locations: location ?? null,
  } satisfies PublicThematicProgram;
}
