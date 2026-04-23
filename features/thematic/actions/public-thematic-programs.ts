"use server";

import { createClient } from "@/utils/supabase";
import { TABLES } from "@/lib/constants/tables";

export type PublicThematicDocumentation = {
  id: string;
  image_before_path: string | null;
  image_after_path: string | null;
};

export type PublicThematicProgram = {
  id: number;
  location_id: number;
  name: string;
  progress_percent: number;
  commodity: string;
  land_area: string;
  production: string;
  total_admin: number;
  distribution_amount: number;
  sppg_partner: string;
  s_curve_path: string;
  documentations: PublicThematicDocumentation[];
  available_locations: {
    name: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
};

type PublicThematicProgramRow = {
  id: number;
  location_id: number;
  name: string;
  progress_percent: number;
  commodity: string;
  land_area: string;
  production: string;
  total_admin: number;
  distribution_amount: number;
  sppg_partner: string;
  s_curve_path: string;
  documentations: unknown;
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

export async function getPublicThematicProgram(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.BIOFLOC_THEMATIC_PROGRAMS)
    .select(
      `
      id,
      location_id,
      name,
      progress_percent,
      commodity,
      land_area,
      production,
      total_admin,
      distribution_amount,
      sppg_partner,
      s_curve_path,
      documentations,
      available_locations (
        name,
        latitude,
        longitude
      )
      `,
    )
    .eq("id", id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle<PublicThematicProgramRow>();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const rawDocumentations = Array.isArray(data.documentations)
    ? data.documentations
    : [];

  const documentations: PublicThematicDocumentation[] = rawDocumentations
    .slice(0, 5)
    .map((doc, index) => {
      const item = doc as Partial<PublicThematicDocumentation>;
      return {
        id: item.id ?? String(index),
        image_before_path: item.image_before_path ?? null,
        image_after_path: item.image_after_path ?? null,
      };
    });

  const location = Array.isArray(data.available_locations)
    ? (data.available_locations[0] ?? null)
    : data.available_locations;

  return {
    id: data.id,
    location_id: data.location_id,
    name: data.name,
    progress_percent: data.progress_percent,
    commodity: data.commodity,
    land_area: data.land_area,
    production: data.production,
    total_admin: data.total_admin,
    distribution_amount: data.distribution_amount,
    sppg_partner: data.sppg_partner,
    s_curve_path: data.s_curve_path,
    documentations,
    available_locations: location ?? null,
  } satisfies PublicThematicProgram;
}
