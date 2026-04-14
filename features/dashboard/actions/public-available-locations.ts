import { createClient } from "@/utils/supabase";

export interface PublicAvailableLocation {
  id: number;
  program_name: string;
  location_name: string;
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
      available_locations(
          name,
          latitude,
          longitude
      )
    `);

  if (error) {
    console.error("Error fetching locations:", error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((item: any) => ({
    id: item.id,
    program_name: item.name,
    location_name: item.available_locations?.name || "Unknown",
    position: {
      latitude: item.available_locations?.latitude || 0,
      longitude: item.available_locations?.longitude || 0,
    },
  }));
}
