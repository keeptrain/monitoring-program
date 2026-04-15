"use server";

import { createClient } from "@/utils/supabase";

export interface PublicAvailableLocation {
  id: number;
  program_name: string;
  location_name: string;
  percentage_of_work: number;
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
      percentage_of_work,
      available_locations(
          name,
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
    percentage_of_work: number;
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
        program_name: item.name,
        location_name: location.name ?? "Unknown",
        percentage_of_work: item.percentage_of_work,
        position: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      },
    ];
  });
}
