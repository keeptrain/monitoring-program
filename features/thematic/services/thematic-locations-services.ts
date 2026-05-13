import { TABLES } from "@/lib/constants/tables";
import { createClient } from "@/utils/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { PublicAvailableLocation } from "../../dashboard/actions/public-available-locations";

async function getThematicLocationsByStatus(
  status: "active" | "potential",
  supabase?: SupabaseClient,
  type: string = "biofloc_thematic",
): Promise<PublicAvailableLocation[]> {
  const _supabase = supabase ?? (await createClient());

  const programTable =
    type === "minapadi_thematic"
      ? TABLES.MINAPADI_THEMATIC_PROGRAMS
      : TABLES.BIOFLOC_THEMATIC_PROGRAMS;

  const { data, error } = await _supabase
    .from(TABLES.AVAILABLE_LOCATIONS)
    .select(
      `
      id,
      province_code,
      province_name,
      name,
      latitude,
      longitude,
      ${programTable}!inner (
        id,
        status,
        progress_percent
      )
    `,
    )
    .eq("type", type)
    .eq(`${programTable}.status`, status)
    .limit(process.env.NODE_ENV === "development" ? 10 : 100); // Increased limit as requested/needed

  if (error) {
    console.error(`Error fetching ${status} locations for ${type}:`, error);
    return [];
  }

  type LocationRow = {
    id: number;
    province_code: string;
    province_name: string;
    name: string;
    latitude: number;
    longitude: number;
  } & Record<string, any>;

  return ((data as unknown as LocationRow[]) ?? []).map((item) => {
    const program = Array.isArray(item[programTable])
      ? item[programTable][0]
      : item[programTable];

    return {
      id: program?.id ?? item.id,
      location_name: item.name,
      province_name: item.province_name,
      progress_percent: program?.progress_percent ?? 0,
      position: {
        latitude: item.latitude ?? 0,
        longitude: item.longitude ?? 0,
      },
    };
  });
}

export async function getActiveLocationsService(
  supabase?: SupabaseClient,
  type?: string,
) {
  return getThematicLocationsByStatus("active", supabase, type);
}

export async function getPotentialLocationsService(
  supabase?: SupabaseClient,
  type?: string,
) {
  return getThematicLocationsByStatus("potential", supabase, type);
}
