import { useQuery } from "@tanstack/react-query";
import { getProposalBioflocDetail } from "@/features/thematic/actions/proposal-biofloc";

export const proposalBioflocDetailQueryKey = (id: string) => [
  "proposal-biofloc",
  id,
];

export function useGetProposalBioflocDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: proposalBioflocDetailQueryKey(id),
    queryFn: () => getProposalBioflocDetail(id),
    enabled,
    staleTime: 1000 * 60 * 3, // 3 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}
