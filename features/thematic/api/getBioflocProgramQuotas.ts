import { useQuery } from "@tanstack/react-query";
import { getBioflocProgramQuotas } from "../actions/program-quotas";

export const getBioflocProgramQuotasQueryKey = () =>
  ["biofloc-program-quotas"] as const;

export const useGetBioflocProgramQuotas = () =>
  useQuery({
    queryKey: getBioflocProgramQuotasQueryKey(),
    queryFn: () => getBioflocProgramQuotas("biofloc_thematic"),
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
