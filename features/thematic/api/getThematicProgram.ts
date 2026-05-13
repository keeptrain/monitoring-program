import { queryOptions, useQuery } from "@tanstack/react-query";
import { getThematicProgramById } from "../actions/thematic-actions";

export const getThematicProgramQueryKey = (id: string) => [
  "thematic-program",
  id,
];

export const getThematicProgramQueryOptions = (id: string) =>
  queryOptions({
    queryKey: getThematicProgramQueryKey(id),
    queryFn: () => getThematicProgramById(id),
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

export const useGetThematicProgram = (id: string, enabled = true) =>
  useQuery({
    ...getThematicProgramQueryOptions(id),
    enabled,
  });
