import { queryOptions, useQuery } from "@tanstack/react-query";
import { ProposalBioflocPaginationParams } from "@/features/proposal/types/proposal-biofloc";
import { getProposalThematicPaginated } from "../actions/proposal-thematic-internal-actions";

export const getProposalThematicQueryKey = (
  params?: Partial<ProposalBioflocPaginationParams>,
) =>
  params
    ? (["proposal-thematic", params] as const)
    : (["proposal-thematic"] as const);

export const getProposalThematicQueryOptions = (
  params: ProposalBioflocPaginationParams,
) =>
  queryOptions({
    queryKey: getProposalThematicQueryKey(params),
    queryFn: () => getProposalThematicPaginated(params),
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

export const useGetProposalThematicPaginated = (
  params: ProposalBioflocPaginationParams,
  enabled = true,
) =>
  useQuery({
    ...getProposalThematicQueryOptions(params),
    enabled,
  });
