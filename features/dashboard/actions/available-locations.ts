"use server";

import { createClient } from "@/utils/supabase";
import { AvailableLocationFormValues } from "../forms/available-location-schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";
import { PublicAvailableLocation } from "./public-available-locations";
import { LocationStatus } from "@/features/monitoring/api/getPublicLocationsByType";
import { cookies } from "next/headers";
import {
  getActiveLocationsService,
  getPotentialLocationsService,
} from "@/features/thematic/services/biofloc-locations-services";

export interface AvailableLocation {
  id: number;
  type: LocationType;
  name: string;
  province_name: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
}

export async function getAvailableLocations() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("available_locations")
    .select("id, type, name, province_name, latitude, longitude, created_at")
    .order("name");

  if (error) {
    console.error("Error fetching locations:", error);
    return [];
  }

  return (data ?? []) as AvailableLocation[];
}

export type ActionResult<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export async function getAvailableLocationsByType(
  type: LocationType,
  status: LocationStatus,
): Promise<ActionResult<PublicAvailableLocation[]>> {
  // Check session for potential status
  if (status === "potential") {
    const cookieStore = await cookies();
    const session = cookieStore.get("session_id")?.value === "true";

    if (!session) {
      return {
        success: false,
        message: "Silakan masuk terlebih dahulu untuk melihat data potensi",
        data: [],
      };
    }
  }

  // Only handle biofloc_thematic for now
  if (type === "biofloc_thematic") {
    const results =
      status === "active"
        ? await getActiveLocationsService()
        : await getPotentialLocationsService();

    return {
      success: true,
      data: results,
    };
  }

  return {
    success: true,
    data: [],
  };
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
export type LocationType =
  | "biofloc_thematic"
  | "minapadi_thematic"
  | "isf"
  | "revitalization";

export async function createLocationFromProgram(
  supabase: SupabaseClient,
  data: {
    type: LocationType;
    name: string;
    latitude: number;
    longitude: number;
    province_id?: string;
    regency_id?: string;
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
    .select("id, type, name, province_name, latitude, longitude, created_at")
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
