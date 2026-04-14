"use server";

import { createClient } from "@/utils/supabase";
import { AvailableLocationFormValues } from "../forms/available-location-schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface AvailableLocation {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
}

export async function getAvailableLocations() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("available_locations")
    .select("id, name, latitude, longitude, created_at")
    .order("name");

  if (error) {
    console.error("Error fetching locations:", error);
    return [];
  }

  return data;
}

export async function createAvailableLocation(
  data: AvailableLocationFormValues
) {
  const supabase = await createClient();
  const { error } = await supabase.from("available_locations").insert(data);

  if (error) {
    console.error("Error creating location:", error);
    return;
  }

  revalidatePath("/dashboard/available-location");
  redirect("/dashboard/available-location");
}
