import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ThematicProgramFormValues } from "../forms/thematic-program-schema";
import { updateThematicProgram } from "../actions/thematic-actions";
import { getThematicProgramQueryKey } from "./getThematicProgram";
import { getThematicProgramsPaginatedQueryKey } from "./getBioflocProgramsPaginated";

export const getUpdateThematicProgramMutationKey = () => [
  "update-thematic-program",
];

export const useUpdateThematicProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUpdateThematicProgramMutationKey(),
    mutationFn: ({
      id,
      values,
    }: {
      id: string | undefined;
      values: ThematicProgramFormValues;
    }) => updateThematicProgram(id!, values),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: getThematicProgramQueryKey(id!),
      });
      queryClient.invalidateQueries({
        queryKey: getThematicProgramsPaginatedQueryKey(),
      });
    },
  });
};
