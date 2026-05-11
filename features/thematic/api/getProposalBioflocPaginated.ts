import { useQuery } from "@tanstack/react-query";
import { getProposalBioflocPaginated } from "@/features/thematic/actions/proposal-biofloc-internal-actions";
import { ProposalBioflocPaginationParams } from "@/features/proposal/types/proposal-biofloc";

export const getProposalBioflocQueryKey = (
  params?: Partial<ProposalBioflocPaginationParams>,
) =>
  params
    ? (["proposal-biofloc", params] as const)
    : (["proposal-biofloc"] as const);

export const useGetProposalBioflocPaginated = (
  params: ProposalBioflocPaginationParams,
  enabled = true,
) =>
  useQuery({
    queryKey: getProposalBioflocQueryKey(params),
    queryFn: () => getProposalBioflocPaginated(params),
    staleTime: 3 * 60 * 1000, // 30 seconds (proposals change frequently)
    gcTime: 5 * 60 * 1000,
    enabled,
  });
