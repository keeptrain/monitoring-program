import { useEffect, useRef } from "react";
import {
  thematicProgramSchema,
  ThematicProgramFormValues,
  ThematicProgramFormInput,
} from "@/features/thematic/forms/thematic-program-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThematicProgramDetail } from "../types/thematic";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { updateThematicProgram } from "../actions/thematic-actions";
import { convertProposalToProgram } from "../actions/proposal-thematic-internal-actions";
import { getThematicProgramsPaginatedQueryKey } from "../api/getBioflocProgramsPaginated";
import { getThematicProgramQueryKey } from "../api/getThematicProgram";
import { toast } from "sonner";
import { getProposalThematicQueryKey } from "../api/getProposalThematicPaginated";

const getDefaultValues = (
  initialData: Partial<ThematicProgramDetail> | undefined,
): ThematicProgramFormInput => {
  return {
    progress_percent: initialData?.progress_percent || 0,
    commodity_aid: initialData?.commodity_aid || "",
    commodity_potential: initialData?.commodity_potential || "",
    land_area: initialData?.land_area || "",
    production_value: initialData?.production_value || "",
    total_management: initialData?.total_management || 0,
    total_members: initialData?.total_members || 0,
    distribution_amount: initialData?.distribution_amount || 0,
    sppg_partner: initialData?.sppg_partner || "",
    s_curve_path: initialData?.s_curve_path || "",
  };
};

export const useThematicProgramForm = (
  initialData: Partial<ThematicProgramDetail> | undefined,
  proposalId?: string,
  isConvertingFromProposal?: boolean,
) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const isEdit = !!initialData?.id;

  const form = useForm<
    ThematicProgramFormInput,
    undefined,
    ThematicProgramFormValues
  >({
    resolver: zodResolver(thematicProgramSchema),
    defaultValues: getDefaultValues(initialData),
  });

  const initialDataRef = useRef(initialData);
  useEffect(() => {
    if (initialData && initialData !== initialDataRef.current) {
      form.reset(getDefaultValues(initialData));
      initialDataRef.current = initialData;
    }
  }, [initialData, form]);

  const onSubmit = (values: ThematicProgramFormValues) => {
    startTransition(async () => {
      try {
        if (isEdit && initialData?.id) {
          // Update existing program
          const { success, message } = await updateThematicProgram(
            initialData.id,
            values,
          );
          if (success) {
            toast.success(message);
            queryClient.invalidateQueries({
              queryKey: getThematicProgramsPaginatedQueryKey(),
            });
            queryClient.invalidateQueries({
              queryKey: getThematicProgramQueryKey(initialData.id),
            });
            router.push("/dashboard/thematic/biofloc");
          }
        } else if (isConvertingFromProposal && proposalId) {
          // Convert proposal to program
          const { success, message } = await convertProposalToProgram(
            proposalId,
            values,
          );
          if (success) {
            queryClient.removeQueries({
              queryKey: getThematicProgramsPaginatedQueryKey(),
            });
            queryClient.invalidateQueries({
              queryKey: getProposalThematicQueryKey(),
            });
            toast.success(message);
            router.push("/dashboard/thematic/biofloc");
          } else {
            console.error("Failed to convert proposal:", message);
          }
        }
      } catch (error) {
        console.error("Failed to submit form:", error);
      }
    });
  };

  return { form, onSubmit: form.handleSubmit(onSubmit), isPending };
};
