import { useQuery } from "@tanstack/react-query";
import { getBioflocProgramsPaginated } from "../actions/biofloc-actions";
import { BioflocScope } from "../types/thematic";
import { BioflocProgramsPaginatedInput } from "../forms/biofloc-program-query-schema";

export const getBioflocProgramsPaginatedQueryKey = (
  params?: Partial<BioflocProgramsPaginatedInput>,
) =>
  params
    ? (["biofloc-thematic-programs-paginated", params] as const)
    : (["biofloc-thematic-programs-paginated"] as const);    

export const useGetBioflocProgramsPaginated = (
  scope: BioflocScope,
  input: Omit<BioflocProgramsPaginatedInput, "scope">,
  enabled = true,
) =>
  useQuery({
    queryKey: getBioflocProgramsPaginatedQueryKey({ ...input, scope }),
    queryFn: () => getBioflocProgramsPaginated({ ...input, scope }),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
