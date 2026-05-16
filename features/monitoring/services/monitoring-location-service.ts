import { createClient } from "@/utils/supabase";
import { ThematicProgram } from "../types/monitoring-types";

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
        longitude
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

  return data;
}
