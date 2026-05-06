import { useQuery, queryOptions } from "@tanstack/react-query";
import { getMonitoringRevitalization } from "../actions/monitoring-revitalization-actions";
import { MonitoringRevitalization } from "../types/monitoring-types";
import { REVITALIZATION_AREAS } from "@/features/revitalisasi/constants/revitalization-area";

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

export function useGetMonitoringRevitalization<T = MonitoringRevitalization>(
  slug?: string | null,
  select?: (data: MonitoringRevitalization) => T,
) {
  return useQuery({
    ...getMonitoringRevitalizationQueryOptions(),
    select: (data) => {
      if (select) return select(data);
      if (!slug) return data as unknown as T;

      const area = REVITALIZATION_AREAS.find((a) => a.slug === slug);
      if (!area) return null as unknown as T;

      return (data.data.find((item) => item?.area_id === area.id) ||
        null) as unknown as T;
    },
  });
}
