"use server";

import { LocationType } from "@/features/dashboard/actions/available-locations";
import {
  getPublicThematicProgram,
  PublicThematicProgram,
} from "@/features/thematic/actions/public-thematic-programs";

/**
 * Registry of return types for different location types.
 * This can be used for type safety across the monitoring feature.
 */
export type MonitoringDetailTypeMap = {
  biofloc_thematic: PublicThematicProgram;
  isf: null; // Add PublicIsfProgram here when available
};

export async function getPublicLocationDetail<T extends LocationType>(
  type: T,
  id: number,
): Promise<MonitoringDetailTypeMap[T] | null> {
  if (!Number.isFinite(id) || id === 0) {
    return null;
  }

  if (type === "biofloc_thematic") {
    return (await getPublicThematicProgram(id)) as
      | MonitoringDetailTypeMap[T]
      | null;
  }

  // Placeholder for ISF
  if (type === "isf") {
    // return getPublicIsfProgram(id);
    return null;
  }

  return null;
}
