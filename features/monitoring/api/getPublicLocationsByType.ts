import {
  getAvailableLocationsByType,
  LocationType,
} from "@/features/dashboard/actions/available-locations";
import { PublicAvailableLocation } from "@/features/dashboard/actions/public-available-locations";
import { getPublicMonitoringIsf } from "@/features/monitoring/actions/public-location";
import { PublicMonitoringIsf } from "../types/monitoring-types";
import { useQuery } from "@tanstack/react-query";

export const getFilterStateQueryKey = (type: LocationType | null) => [
  "filter-state",
  type,
];

export const useGetPublicLocationsByType = (type: LocationType | null) =>
  useQuery({
    queryKey: getFilterStateQueryKey(type),
    queryFn: async (): Promise<PublicAvailableLocation[]> => {
      if (!type) return [];
      return getAvailableLocationsByType(type);
    },
    enabled: !!type && type !== "isf",
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
