import { convertProposalToProgram } from "@/features/thematic/actions/proposal-thematic-internal-actions";
import { getThematicProgramsPaginatedQueryKey } from "@/features/thematic/api/getBioflocProgramsPaginated";
import { getProposalThematicQueryKey } from "@/features/thematic/api/getProposalThematicPaginated";
import { ThematicProgramFormValues } from "@/features/thematic/forms/thematic-program-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useConvertProposalToPotential = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: ThematicProgramFormValues;
    }) => convertProposalToProgram(id, values),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: getThematicProgramsPaginatedQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: getProposalThematicQueryKey(),
      });
    },
  });
};
