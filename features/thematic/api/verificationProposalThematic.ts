import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyProposalThematic } from "@/features/thematic/actions/proposal-biofloc-internal-actions";
import { ProposalVerificationFormValues } from "../forms/proposal-verification-schema";

import { getProposalThematicQueryKey } from "./getProposalThematicPaginated";

export const useVerificationProposalThematic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ProposalVerificationFormValues;
    }) => verifyProposalThematic(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: getProposalThematicQueryKey(),
      }),
  });
};
