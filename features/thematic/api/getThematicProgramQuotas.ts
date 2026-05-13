import { useQuery } from "@tanstack/react-query";
import { getBioflocProgramQuotas } from "../actions/program-quotas";
import { ThematicType } from "../constants/filter-state";

export const getThematicProgramQuotasQueryKey = (
  programType: ThematicType = "biofloc_thematic",
) => ["thematic-program-quotas", programType] as const;

export const useGetThematicProgramQuotas = (
  programType: ThematicType = "biofloc_thematic",
) =>
  useQuery({
    queryKey: getThematicProgramQuotasQueryKey(programType),
    queryFn: () => getBioflocProgramQuotas(programType),
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
