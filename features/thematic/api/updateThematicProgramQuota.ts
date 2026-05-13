import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertBioflocProgramQuota } from "../actions/program-quotas";
import { getThematicProgramQuotasQueryKey } from "./getThematicProgramQuotas";
import { ThematicType } from "../constants/filter-state";

type UpdateQuotaPayload = {
  province_code: string;
  province_name: string;
  quota_limit: number;
};

export const useUpdateThematicProgramQuota = (
  programType: ThematicType = "biofloc_thematic",
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateQuotaPayload) =>
      upsertBioflocProgramQuota({
        ...payload,
        program_type: programType,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getThematicProgramQuotasQueryKey(programType),
      });
    },
  });
};
