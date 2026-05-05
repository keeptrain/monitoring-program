import {
  getAvailableLocationsByType,
  LocationType,
} from "@/features/dashboard/actions/available-locations";
import { PublicAvailableLocation } from "@/features/dashboard/actions/public-available-locations";
import { getMonitoringIsf } from "@/features/monitoring/actions/public-location";
import { MonitoringIsf } from "../types/monitoring-types";
import { useQuery, useQueries, queryOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export type LocationStatus = "potential" | "active";

export const getLocationsQueryKey = (
  type: LocationType,
  status: LocationStatus,
) => ["locations", type, status];

const getLocationsQueryOptions = (type: LocationType, status: LocationStatus) =>
  queryOptions({
    queryKey: getLocationsQueryKey(type, status),
    queryFn: async (): Promise<PublicAvailableLocation[]> => {
      const result = await getAvailableLocationsByType(type, status);
      if (!result.success && result.message) {
        toast.error(result.message);
      }
      return result.data;
    },
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

export const useGetMonitoringLocationsByType = (
  type: LocationType,
  status: LocationStatus,
  enabled: boolean = true,
) =>
  useQuery({
    ...getLocationsQueryOptions(type, status),
    enabled,
  });

export const useGetMonitoringLocationsCombined = (
  type: LocationType,
  statuses: LocationStatus[],
) => {
  const results = useQueries({
    queries: statuses.map((status) => getLocationsQueryOptions(type, status)),
  });

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  const combinedData = results.flatMap((result, index) => {
    const status = statuses[index];
    const data = result.data ?? [];
    return data.map((l) => ({
      ...l,
      isPotential: status === "potential",
    }));
  });

  return {
    data: combinedData,
    isLoading,
    isError,
    results: statuses.reduce(
      (acc, status, index) => {
        acc[status] = results[index];
        return acc;
      },
      {} as Record<LocationStatus, (typeof results)[0]>,
    ),
  };
};

export const getMonitoringIsfQueryKey = () => [
  "monitoring",
  "isf",
];

export const useGetMonitoringIsf = () =>
  useQuery({
    queryKey: getMonitoringIsfQueryKey(),
    queryFn: async (): Promise<MonitoringIsf> => getMonitoringIsf(),
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
