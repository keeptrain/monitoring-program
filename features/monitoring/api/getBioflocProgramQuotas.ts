import { queryOptions } from "@tanstack/react-query";
import { getBioflocProgramQuotasPublic } from "@/features/thematic/actions/program-quotas";

export const getThematicProgramQuotasQueryKey = (
  thematicType: "biofloc_thematic" | "minapadi_thematic",
) => ["thematic-program-quotas", thematicType] as const;

export const getThematicProgramQuotasQueryOptions = (
  thematicType: "biofloc_thematic" | "minapadi_thematic",
) =>
  queryOptions({
    queryKey: getThematicProgramQuotasQueryKey(thematicType),
    queryFn: getBioflocProgramQuotasPublic,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
