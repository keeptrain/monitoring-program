import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  verifyProposalThematic,
  rollbackProposalThematic,
} from "@/features/thematic/actions/proposal-thematic-internal-actions";
import { ProposalVerificationFormValues } from "../forms/proposal-verification-schema";

import { getProposalThematicQueryKey } from "./getProposalThematicPaginated";

export const useVerificationProposalThematic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ProposalVerificationFormValues;
    }) => {
      const res = await verifyProposalThematic(id, data);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: getProposalThematicQueryKey(),
      }),
  });
};

export const useRollbackProposalThematic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await rollbackProposalThematic(id);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: getProposalThematicQueryKey(),
      }),
  });
};
