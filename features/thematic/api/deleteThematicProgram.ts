import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteThematicProgram } from "../actions/thematic-actions";
import { getThematicProgramsPaginatedQueryKey } from "./getBioflocProgramsPaginated";
import { getProposalThematicQueryKey } from "./getProposalThematicPaginated";

export function useDeleteThematicProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const result = await deleteThematicProgram(id);
      if (!result.success) {
        throw new Error(result.message || "Gagal menghapus program");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getThematicProgramsPaginatedQueryKey(),
      });
      queryClient.removeQueries({
        queryKey: getProposalThematicQueryKey(),
      })
    },
  });
}
