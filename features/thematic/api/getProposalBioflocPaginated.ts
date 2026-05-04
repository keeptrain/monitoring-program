import { useQuery } from "@tanstack/react-query";
import { getProposalBioflocPaginated } from "@/features/thematic/actions/proposal-biofloc";
import { ProposalBioflocPaginationParams } from "@/features/proposal/types/proposal-biofloc";

export const proposalBioflocQueryKey = (
  params: ProposalBioflocPaginationParams,
) => ["proposal-biofloc", params] as const;

export const useGetProposalBioflocPaginated = (
  params: ProposalBioflocPaginationParams,
  enabled = true,
) =>
  useQuery({
    queryKey: proposalBioflocQueryKey(params),
    queryFn: () => getProposalBioflocPaginated(params),
    staleTime: 3 * 60 * 1000, // 30 seconds (proposals change frequently)
    gcTime: 5 * 60 * 1000,
    enabled,
  });
