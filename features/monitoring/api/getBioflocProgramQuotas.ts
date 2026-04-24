import { useQuery } from "@tanstack/react-query";
import { getBioflocProgramQuotas2026 } from "@/features/thematic/actions/program-quotas";

export const getBioflocProgramQuotasQueryKey = () => [
  "biofloc-program-quotas",
] as const;

export const useGetBioflocProgramQuotas = (enabled: boolean) =>
  useQuery({
    queryKey: getBioflocProgramQuotasQueryKey(),
    queryFn: getBioflocProgramQuotas2026,
    enabled,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
