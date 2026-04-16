"use server";

import { createClient } from "@/utils/supabase";
import { AvailableLocationFormValues } from "../forms/available-location-schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";
import { PublicAvailableLocation } from "./public-available-locations";

export interface AvailableLocation {
  id: number;
  type: LocationType;
  name: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
}

export async function getAvailableLocations() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("available_locations")
    .select("id, type, name, latitude, longitude, created_at")
    .order("name");

  if (error) {
    console.error("Error fetching locations:", error);
    return [];
  }

  return (data ?? []) as AvailableLocation[];
}

export async function getAvailableLocationsByType(
  type: LocationType,
): Promise<PublicAvailableLocation[]> {
  const supabase = await createClient();

  const programTable =
    type === "biofloc_thematic" ? "thematic_programs" : "isf_programs";

  const { data, error } = await supabase
    .from("available_locations")
    .select(
      `
      id,
      name,
      latitude,
      longitude,
      ${programTable}!inner (
        id,
        name,
        percentage_of_work
      )
    `,
    )
    .eq("type", type);

  if (error) {
    console.error("getAvailableLocationsByType error:", error);
    return [];
  }

  type LocationWithProgramRow = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  } & Record<string, unknown>;

  return ((data as unknown as LocationWithProgramRow[]) ?? []).map((item) => {
    const program = Array.isArray(item[programTable])
      ? item[programTable][0]
      : item[programTable];

    return {
      id: program?.id ?? item.id,
      program_name: program?.name ?? "Unknown Program",
      location_name: item.name,
      percentage_of_work: program?.percentage_of_work ?? 0,
      position: {
        latitude: item.latitude ?? 0,
        longitude: item.longitude ?? 0,
      },
    };
  });
}

export async function createAvailableLocation(
  data: AvailableLocationFormValues,
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
export type LocationType = "biofloc_thematic" | "isf";

export async function createLocationFromProgram(
  supabase: SupabaseClient,
  data: {
    type: LocationType;
    name: string;
    latitude: number;
    longitude: number;
  },
) {
  const { data: locationData, error } = await supabase
    .from("available_locations")
    .insert(data)
    .select("id")
    .single();

  if (error) {
    console.error("Error creating location:", error);
    return;
  }

  return locationData?.id;
}

export async function getAvailableLocationById(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("available_locations")
    .select("id, type, name, latitude, longitude, created_at")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data as AvailableLocation;
}

export async function updateAvailableLocation(
  id: number,
  data: AvailableLocationFormValues,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("available_locations")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("Error updating location:", error);
    return;
  }

  revalidatePath("/dashboard/available-location");
  revalidatePath(`/dashboard/available-location/form/${id}`);
  redirect("/dashboard/available-location");
}
