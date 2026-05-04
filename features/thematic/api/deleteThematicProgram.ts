import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteThematicProgram } from "../actions/biofloc";
import { getBioflocProgramsPaginatedQueryKey } from "./getBioflocProgramsPaginated";

export function useDeleteThematicProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const result = await deleteThematicProgram(id);
      if (!result.success) {
        throw new Error(result.message || "Gagal menghapus program");
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: getBioflocProgramsPaginatedQueryKey(),
      }),
  });
}
