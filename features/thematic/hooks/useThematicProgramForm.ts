import { useEffect, useRef } from "react";
import {
  thematicProgramSchema,
  ThematicProgramFormValues,
  ThematicProgramFormInput,
} from "@/features/thematic/forms/thematic-program-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThematicProgramDetail } from "../types/thematic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConvertProposalToPotential } from "@/features/proposal/api/convertProposalToPotential";
import { useUpdateThematicProgram } from "../api/updateThematicProgram";

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

  const {
    mutateAsync: convertProposalToPotential,
    isPending: isPendingConvert,
  } = useConvertProposalToPotential();

  const { mutateAsync: updateThematicProgram, isPending: isPendingUpdate } =
    useUpdateThematicProgram();

  const onSubmit = (values: ThematicProgramFormValues) => {
    if (isConvertingFromProposal && proposalId) {
      convertProposalToPotential(
        { id: proposalId, values },
        {
          onSuccess: (data) => {
            toast.success("Proposal berhasil dikonversi menjadi program");
            if (data.success && data.data?.href) {
              router.push(data.data.href);
            }
          },
          onError: () => toast.error("Gagal mengkonversi proposal"),
        },
      );
    } else if (isEdit) {
      updateThematicProgram(
        { id: initialData?.id, values },
        {
          onSuccess: () => {
            toast.success("Program berhasil diperbarui");
            router.back();
          },
          onError: () => toast.error("Gagal memperbarui program"),
        },
      );
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: isPendingConvert || isPendingUpdate,
  };
};
