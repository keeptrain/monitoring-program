import { createClient } from "@/utils/supabase";
import { ThematicProgram } from "../types/monitoring-types";
import { LocationType } from "@/features/dashboard/actions/available-locations";
import { TABLES } from "@/lib/constants/tables";
import { LocationStatus } from "../api/getMonitoringLocationsByType";

export async function getMonitoringLocationsByType(
  programTableName: string,
  type: LocationType,
  status: LocationStatus | null,
) {
  const supabase = await createClient();

  const programJoin = status
    ? `${programTableName}!inner(id, status, progress_percent)`
    : `${programTableName}(id, status, progress_percent)`;

  const regencyJoin =
    status === "potential" && type === "biofloc_thematic"
      ? "ref_regencies (name),"
      : "";

  let query = supabase
    .from(TABLES.AVAILABLE_LOCATIONS)
    .select(
      `
      id,
      province_code,
      province_name,
      name,
      latitude,
      longitude,
      ${regencyJoin}
      ${programJoin}
      `,
    )
    .eq("type", type);

  if (status) {
    query = query.eq(`${programTableName}.status`, status);
  }

  if (process.env.NODE_ENV === "development") {
    query = query.limit(10);
  }

  const { data, error } = await query;

  if (error) {
    console.error(
      `Error fetching locations for ${type} with status ${status}:`,
      error,
    );
    throw new Error(`Failed to fetch monitoring locations: ${error.message}`);
  }

  type LocationRow = {
    id: number;
    province_code: string;
    province_name: string;
    name: string;
    latitude: number;
    longitude: number;
    ref_regencies?: { name: string } | null;
  } & Record<string, any>;

  return ((data as unknown as LocationRow[]) ?? []).map((item) => {
    const program = Array.isArray(item[programTableName])
      ? item[programTableName][0]
      : item[programTableName];

    return {
      id: program?.id,
      location_name: item.name,
      province_name: item.province_name,
      province_code: item.province_code,
      regency_name: item.ref_regencies?.name,
      progress_percent: program?.progress_percent ?? 0,
      position: {
        latitude: item.latitude ?? 0,
        longitude: item.longitude ?? 0,
      },
    };
  });
}

/**
 * @param isAuthenticated
 * @param id
 * @param tableName
 * @returns
 */
export async function getMonitoringLocationDetailService(
  isAuthenticated: boolean,
  id: string,
  tableName: string,
) {
  const supabase = await createClient();

  // Conditionally include sensitive fields only for authenticated users
  const entityFields = [
    "name",
    isAuthenticated ? "kusuka_number" : null,
    isAuthenticated ? "nib" : null,
    isAuthenticated ? "legal_entity_number" : null,
    "board_member_count",
    "member_count",
  ]
    .filter(Boolean)
    .join(", ");

  const { data, error } = await supabase
    .from(tableName)
    .select(
      `
      id,
      location_id,
      proposal_id,
      progress_percent,
      commodity_aid,
      commodity_potential,
      land_area,
      production_value,
      distribution_amount,
      sppg_partner,
      s_curve_path,
      updated_at,
      kdmp_entities (${entityFields}),
      available_locations (
        name,
        latitude,
        longitude,
        ref_provinces (name),
        ref_regencies (name),
        ref_districts (name),
        ref_villages (name)
      )
      `,
    )
    .eq("id", id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle<ThematicProgram>();

  if (error) {
    console.error(`[DB ERROR][${tableName}]:`, error.message);
    throw new Error("Failed to fetch data from database");
  }

  if (!data) {
    console.warn(`[NOT FOUND][${tableName}]: ID ${id} not found`);
    throw new Error("Monitoring data not found");
  }

  // Format full location string
  if (data.available_locations) {
    const loc = data.available_locations;
    const locationParts = [
      loc.ref_provinces?.name,
      loc.ref_regencies?.name,
      loc.ref_districts?.name,
      loc.ref_villages?.name,
    ].filter(Boolean);

    data.full_location =
      locationParts.length > 0 ? locationParts.join(", ") : "-";
  }

  return data;
}
