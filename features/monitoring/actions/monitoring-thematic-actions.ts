"use server";

import {
  ActionResult,
  LocationType,
} from "@/features/dashboard/actions/available-locations";
import { PublicAvailableLocation } from "@/features/dashboard/actions/public-available-locations";
import { getSession } from "@/features/auth/session";
import { getMonitoringLocationsByType } from "../services/monitoring-location-service";
import {
  THEMATIC_CONFIG,
  ThematicProgramType,
} from "@/features/thematic/constants/thematic-constants";
import { cookies } from "next/headers";

export interface ProvincePotentialData {
  province_code: string;
  province_name: string;
  count: number;
  regencies: string[];
}

export interface MonitoringLocationsThematicResult {
  active: PublicAvailableLocation[];
  potential: PublicAvailableLocation[] | ProvincePotentialData[];
}

export async function getMonitoringLocationsThematic(
  type: LocationType,
): Promise<ActionResult<MonitoringLocationsThematicResult>> {
  try {
    const cookieStore = await cookies();
    const hasSession = cookieStore.has("session");

    let isLoggedIn = false;

    if (hasSession) {
      const session = await getSession();
      isLoggedIn = session.isLoggedIn;
    }

    const programTableName =
      THEMATIC_CONFIG[type as ThematicProgramType].programTable;

    // Always fetch active locations
    const activeResults = await getMonitoringLocationsByType(
      programTableName,
      type,
      "active",
    );

    const potentialLocations = isLoggedIn
      ? await getMonitoringLocationsByType(programTableName, type, "potential")
      : [];

    return {
      success: true,
      data: {
        active: activeResults,
        potential:
          isLoggedIn && type === "biofloc_thematic"
            ? groupLocationsByProvince(potentialLocations)
            : potentialLocations,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch monitoring thematic locations",
      data: null,
    };
  }
}

function groupLocationsByProvince(
  locations: PublicAvailableLocation[],
): ProvincePotentialData[] {
  const grouped = new Map<
    string,
    {
      province_code: string;
      province_name: string;
      count: number;
      regencies: string[];
    }
  >();

  for (const loc of locations) {
    const code = loc.province_code ?? "unknown";
    const existing = grouped.get(code);
    const regency = loc.regency_name ?? "unknown";
    if (existing) {
      existing.count++;
      if (regency && !existing.regencies.includes(regency)) {
        existing.regencies.push(regency);
      }
    } else {
      grouped.set(code, {
        province_code: code,
        province_name: loc.province_name,
        count: 1,
        regencies: regency ? [regency] : [],
      });
    }
  }

  return Array.from(grouped.values());
}
