import { useQuery } from "@tanstack/react-query";
import { getRevitalizationStats } from "../actions/monitoring-revitalization-actions";

export const getRevitalizationQueryKey = () => ["revitalization-stats"];

export const useGetRevitalizationStats = (enabled: boolean) =>
  useQuery({
    queryKey: getRevitalizationQueryKey(),
    queryFn: getRevitalizationStats,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled,
  });
