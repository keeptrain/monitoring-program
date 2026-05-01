import { TABLES } from "@/lib/constants/tables";
import { createClient } from "@/utils/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { PublicAvailableLocation } from "../../dashboard/actions/public-available-locations";
import { INDONESIA_PROVINCES } from "../constants/indonesia-provinces";

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
      province_id,
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
    .limit(10); // Increased limit as requested/needed

  if (error) {
    console.error(`Error fetching ${status} biofloc locations:`, error);
    return [];
  }

  type LocationRow = {
    id: number;
    province_id: string;
    name: string;
    latitude: number;
    longitude: number;
  } & Record<string, any>;

  return ((data as unknown as LocationRow[]) ?? []).map((item) => {
    const program = Array.isArray(item[TABLES.BIOFLOC_THEMATIC_PROGRAMS])
      ? item[TABLES.BIOFLOC_THEMATIC_PROGRAMS][0]
      : item[TABLES.BIOFLOC_THEMATIC_PROGRAMS];

    const provinceName =
      INDONESIA_PROVINCES.find((p) => p.province_id === item.province_id)
        ?.name ?? "Provinsi Tidak Diketahui";

    return {
      id: program?.id ?? item.id,
      location_name: item.name,
      province_name: provinceName,
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
