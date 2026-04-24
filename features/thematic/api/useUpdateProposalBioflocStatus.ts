import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProposalBioflocStatus } from "@/features/thematic/actions/proposal-biofloc";

export const useUpdateProposalBioflocStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: "Disetujui" | "Ditolak";
    }) => updateProposalBioflocStatus(id, status),
    onSuccess: () => {
      // Invalidate relevant queries so the table refreshes
      queryClient.invalidateQueries({ queryKey: ["proposal-biofloc"] });
    },
  });
};
