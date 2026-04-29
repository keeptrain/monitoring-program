import {
  getAvailableLocationsByType,
  LocationType,
} from "@/features/dashboard/actions/available-locations";
import { PublicAvailableLocation } from "@/features/dashboard/actions/public-available-locations";
import { getPublicMonitoringIsf } from "@/features/monitoring/actions/public-location";
import { PublicMonitoringIsf } from "../types/monitoring-types";
import { useQuery } from "@tanstack/react-query";

export type LocationStatus = "potential" | "active";

export const getLocationsQueryKey = (
  type: LocationType,
  status: LocationStatus,
) => ["locations", type, status];

export const useGetPublicLocationsByType = (
  type: LocationType,
  status: LocationStatus,
) =>
  useQuery({
    queryKey: getLocationsQueryKey(type, status),
    queryFn: async (): Promise<PublicAvailableLocation[]> =>
      getAvailableLocationsByType(type, status),
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

export const getPublicMonitoringIsfQueryKey = () => [
  "public-monitoring",
  "isf",
];

export const useGetPublicMonitoringIsf = () =>
  useQuery({
    queryKey: getPublicMonitoringIsfQueryKey(),
    queryFn: async (): Promise<PublicMonitoringIsf> => getPublicMonitoringIsf(),
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
