"use server";

import { createClient } from "@/utils/supabase";

export async function getAvailableLocations() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("available_locations")
    .select("id, name")
    .order("name");

  if (error) {
    console.error("Error fetching locations:", error);
    return [];
  }

  return data;
}
