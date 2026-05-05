import { useQuery, queryOptions } from "@tanstack/react-query";
import { getMonitoringRevitalization } from "../actions/monitoring-revitalization-actions";
import { MonitoringRevitalization } from "../types/monitoring-types";

export const getMonitoringRevitalizationQueryKey = () => [
  "monitoring",
  "revitalization",
];

export const getMonitoringRevitalizationQueryOptions = () =>
  queryOptions({
    queryKey: getMonitoringRevitalizationQueryKey(),
    queryFn: async (): Promise<MonitoringRevitalization> =>
      getMonitoringRevitalization(),
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

export const useGetMonitoringRevitalization = () =>
  useQuery({
    ...getMonitoringRevitalizationQueryOptions(),
  });
