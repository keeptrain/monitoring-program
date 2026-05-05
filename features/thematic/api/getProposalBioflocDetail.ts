import { queryOptions, useQuery } from "@tanstack/react-query";
import { getProposalBioflocDetail } from "../actions/proposal-biofloc-internal-actions";

export const getProposalBioflocDetailQueryKey = (id: string) => [
  "proposal-biofloc",
  id,
];

export const getProposalBioflocDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: getProposalBioflocDetailQueryKey(id),
    queryFn: () => getProposalBioflocDetail(id),
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

export const useGetProposalBioflocDetail = (id: string, enabled = true) =>
  useQuery({
    ...getProposalBioflocDetailQueryOptions(id),
    enabled,
  });
