import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProposalBioflocStatus } from "@/features/thematic/actions/proposal-biofloc";
import { ProposalBioflocStatus } from "../types/thematic";

export const useUpdateProposalBioflocStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: ProposalBioflocStatus;
    }) => updateProposalBioflocStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal-biofloc"] });
    },
  });
};
