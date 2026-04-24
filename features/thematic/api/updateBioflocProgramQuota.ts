import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertBioflocProgramQuota } from "../actions/program-quotas";
import { getBioflocProgramQuotasQueryKey } from "./getBioflocProgramQuotas";

type UpdateQuotaPayload = {
  region_id: string;
  quota_limit: number;
};

export const useUpdateBioflocProgramQuota = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateQuotaPayload) =>
      upsertBioflocProgramQuota(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getBioflocProgramQuotasQueryKey(),
      });
    },
  });
};
