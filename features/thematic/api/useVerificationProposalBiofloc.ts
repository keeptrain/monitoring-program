import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyProposalBiofloc } from "@/features/thematic/actions/proposal-biofloc";
import { ProposalVerificationFormValues } from "../forms/proposal-verification-schema";

export const useVerificationProposalBiofloc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ProposalVerificationFormValues;
    }) => verifyProposalBiofloc(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal-biofloc"] });
    },
  });
};
