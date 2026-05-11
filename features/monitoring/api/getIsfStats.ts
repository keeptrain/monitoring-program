import { useQuery } from "@tanstack/react-query";
import { getIsfStats } from "../actions/monitoring-isf-actions";
import { IsfStats } from "../types/monitoring-types";

export const getIsfStatsQueryKey = () => ["isf-stats"];

export const useGetIsfStats = (enabled: boolean = true) =>
  useQuery<IsfStats>({
    queryKey: getIsfStatsQueryKey(),
    queryFn: getIsfStats,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled,
  });
