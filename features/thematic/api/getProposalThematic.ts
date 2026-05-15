import { queryOptions, useQuery } from "@tanstack/react-query";
import { getProposalThematic } from "../actions/proposal-thematic-internal-actions";

export const getProposalThematicQueryKey = (id: string) => [
  "proposal-thematic",
  id,
];

export const getProposalThematicQueryOptions = (id: string) =>
  queryOptions({
    queryKey: getProposalThematicQueryKey(id),
    queryFn: () => getProposalThematic(id),
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

export const useGetProposalThematic = (id: string) =>
  useQuery({
    ...getProposalThematicQueryOptions(id),
    enabled: !!id,
  });
