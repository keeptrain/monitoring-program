import { queryOptions, useQuery } from "@tanstack/react-query";
import { getThematicProgramsPaginated } from "../actions/thematic-actions";
import { BioflocScope, ThematicProgramType } from "../types/thematic";
import { BioflocProgramsPaginatedInput } from "../forms/biofloc-program-query-schema";

export const getThematicProgramsPaginatedQueryKey = (
  thematicType?: ThematicProgramType,
  params?: Partial<BioflocProgramsPaginatedInput>,
) =>
  params && thematicType
    ? (["thematic-programs-paginated", thematicType, params] as const)
    : thematicType
      ? (["thematic-programs-paginated", thematicType] as const)
      : (["thematic-programs-paginated"] as const);

export const getThematicProgramsPaginatedQueryOptions = (
  thematicType: ThematicProgramType,
  input: Omit<BioflocProgramsPaginatedInput, "scope">,
  scope: BioflocScope,
  enabled = true,
) =>
  queryOptions({
    queryKey: getThematicProgramsPaginatedQueryKey(thematicType, {
      ...input,
      scope,
    }),
    queryFn: () =>
      getThematicProgramsPaginated(thematicType, { ...input, scope }),
    enabled,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

export const useGetThematicProgramsPaginated = (
  thematicType: ThematicProgramType,
  scope: BioflocScope,
  input: Omit<BioflocProgramsPaginatedInput, "scope">,
  enabled = true,
) =>
  useQuery(
    getThematicProgramsPaginatedQueryOptions(
      thematicType,
      input,
      scope,
      enabled,
    ),
  );
