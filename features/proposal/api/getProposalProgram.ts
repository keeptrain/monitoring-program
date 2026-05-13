import { queryOptions, useQuery } from "@tanstack/react-query";

export const getProposalThematicProgramQueryKey = () => ["proposal-program"];

export const getProposalThematicProgramQueryOptions = queryOptions({
  queryKey: getProposalThematicProgramQueryKey(),
  staleTime: 3 * 60 * 1000,
  gcTime: 5 * 60 * 1000,
});

export const useGetProposalThematicProgram = () =>
  useQuery(getProposalThematicProgramQueryOptions);
