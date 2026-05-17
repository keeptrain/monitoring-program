import { LocationType } from "@/features/dashboard/actions/available-locations";
import { PublicAvailableLocation } from "@/features/dashboard/actions/public-available-locations";
import { getMonitoringIsf } from "@/features/monitoring/actions/public-location";
import { MonitoringIsf } from "../types/monitoring-types";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMonitoringLocationsThematic,
  MonitoringLocationsThematicResult,
  ProvincePotentialData,
} from "../actions/monitoring-thematic-actions";

export type LocationStatus = "potential" | "active";

export const getMonitoringThematicLocationsQueryKey = (type: LocationType) => [
  "monitoring-thematic-locations",
  type,
];

const getMonitoringThematicLocationsQueryOptions = (type: LocationType) =>
  queryOptions({
    queryKey: getMonitoringThematicLocationsQueryKey(type),
    queryFn: async (): Promise<MonitoringLocationsThematicResult> => {
      const result = await getMonitoringLocationsThematic(type);
      if (!result.success && result.message) {
        toast.error(result.message);
        return { active: [], potential: [] };
      }
      return result.data ?? { active: [], potential: [] };
    },
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

export interface MapMarkerLocation extends PublicAvailableLocation {
  isPotential?: boolean;
}

export const useGetMonitoringLocationsThematic = (
  type: LocationType,
  statuses: string[],
) => {
  return useQuery({
    ...getMonitoringThematicLocationsQueryOptions(type),
    select: (data) => {
      const activeData: MapMarkerLocation[] = statuses.includes("active")
        ? data.active
        : [];

      const potentialData = statuses.includes("potential")
        ? type === "biofloc_thematic" && Array.isArray(data.potential)
          ? (data.potential as ProvincePotentialData[]).reduce<
              Record<string, { count: number; regencies: string[] }>
            >((acc, curr) => {
              acc[curr.province_code] = {
                count: curr.count,
                regencies: curr.regencies,
              };
              return acc;
            }, {})
          : type === "minapadi_thematic" && Array.isArray(data.potential)
            ? (data.potential as PublicAvailableLocation[]).map((l) => ({
                ...l,
                isPotential: true,
              }))
            : []
        : type === "biofloc_thematic"
          ? {}
          : [];

      return {
        active: activeData,
        potential: potentialData,
      };
    },
  });
};


/**
 * Gets the query key for monitoring ISF data.
 * @returns Monitoring isf data
 */
export const getMonitoringIsfQueryKey = () => ["monitoring", "isf"];

export const useGetMonitoringIsf = () =>
  useQuery({
    queryKey: getMonitoringIsfQueryKey(),
    queryFn: async (): Promise<MonitoringIsf> => getMonitoringIsf(),
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
