import { TABLES } from "@/lib/constants/tables";
import { createClient } from "@/utils/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { PublicAvailableLocation } from "../../dashboard/actions/public-available-locations";

async function getBioflocLocationsByStatus(
  status: "active" | "potential",
  supabase?: SupabaseClient,
): Promise<PublicAvailableLocation[]> {
  const _supabase = supabase ?? (await createClient());

  const { data, error } = await _supabase
    .from("available_locations")
    .select(
      `
      id,
      province_code,
      province_name,
      name,
      latitude,
      longitude,
      ${TABLES.BIOFLOC_THEMATIC_PROGRAMS}!inner (
        id,
        status,
        progress_percent
      )
    `,
    )
    .eq("type", "biofloc_thematic")
    .eq(`${TABLES.BIOFLOC_THEMATIC_PROGRAMS}.status`, status)
    .limit(process.env.NODE_ENV === "development" ? 10 : 100); // Increased limit as requested/needed

  if (error) {
    console.error(`Error fetching ${status} biofloc locations:`, error);
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
    const program = Array.isArray(item[TABLES.BIOFLOC_THEMATIC_PROGRAMS])
      ? item[TABLES.BIOFLOC_THEMATIC_PROGRAMS][0]
      : item[TABLES.BIOFLOC_THEMATIC_PROGRAMS];

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

export async function getActiveLocationsService(supabase?: SupabaseClient) {
  return getBioflocLocationsByStatus("active", supabase);
}

export async function getPotentialLocationsService(supabase?: SupabaseClient) {
  return getBioflocLocationsByStatus("potential", supabase);
}
