import { useQuery } from "@tanstack/react-query";
import {
  getProposalBioflocPaginated,
  ProposalBioflocPaginationParams,
} from "@/features/thematic/actions/proposal-biofloc";

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
    staleTime: 30 * 1000, // 30 seconds (proposals change frequently)
    gcTime: 2 * 60 * 1000,
    enabled,
  });
