"use server";

import { createClient } from "@/utils/supabase";

export interface PublicAvailableLocation {
  id: number;
  location_name: string;
  province_name: string;
  progress_percent: number;
  position: {
    latitude: number;
    longitude: number;
  };
}

export async function getPublicAvailableLocations(): Promise<
  PublicAvailableLocation[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("program_priority_reports")
    .select(`
      id,
      name,
      progress_percent,
      available_locations(
          name,
          province_name,
          latitude,
          longitude
      )
    `);

  if (error) {
    console.error("Error fetching public available locations:", error);
    return [];
  }

  type PublicAvailableLocationRow = {
    id: number;
    name: string;
    progress_percent: number;
    available_locations:
      | {
          name: string | null;
          province_name: string | null;
          latitude: number | null;
          longitude: number | null;
        }
      | Array<{
          name: string | null;
          province_name: string | null;
          latitude: number | null;
          longitude: number | null;
        }>
      | null;
  };

  return ((data ?? []) as PublicAvailableLocationRow[]).flatMap((item) => {
    const location = Array.isArray(item.available_locations)
      ? item.available_locations[0]
      : item.available_locations;

    if (!location) {
      return [];
    }

    if (location.latitude == null || location.longitude == null) {
      return [];
    }

    return [
      {
        id: item.id,
        location_name: location.name ?? "Unknown",
        province_name: location.province_name ?? "Unknown",
        progress_percent: item.progress_percent,
        position: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      },
    ];
  });
}
