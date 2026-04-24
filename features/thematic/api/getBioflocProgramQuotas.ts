import { useQuery } from "@tanstack/react-query";
import { getBioflocProgramQuotas2026 } from "../actions/program-quotas";

export const getBioflocProgramQuotasQueryKey = () =>
  ["biofloc-program-quotas"] as const;

export const useGetBioflocProgramQuotas = () =>
  useQuery({
    queryKey: getBioflocProgramQuotasQueryKey(),
    queryFn: getBioflocProgramQuotas2026,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
