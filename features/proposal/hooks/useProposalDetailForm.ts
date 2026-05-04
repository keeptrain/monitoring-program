import { useForm, DefaultValues } from "react-hook-form";
import {
  ProposalDetailFormInput,
  ProposalDetailFormValues,
  proposalDetailSchema,
} from "../forms/proposal-detail-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import {
  useProposalStore,
  getFormDataFromStore,
  ProposalState,
} from "../api/proposal-store";
import { createProposal } from "../api/proposal-actions";
import { toast } from "sonner";

const CREATE_DEFAULT_VALUES: DefaultValues<ProposalDetailFormInput> = {
  has_letter_of_land_preparation_and_use: undefined,
  proposed_commodity: undefined,
  has_member_with_experience: undefined,
  commodity_potentials: [],
  other_commodity_potential: "",
  proposal_path: "",
  documentations: [{ image_before_paths: [] }],
};

export const useProposalDetailForm = () => {
  const [step, setStep] = useQueryState(
    "step",
    parseAsInteger.withDefault(3).withOptions({
      shallow: false,
      clearOnDefault: false,
    }),
  );

  const step3Data = useProposalStore((state) => state.step3Data);
  const setStep3Data = useProposalStore((state) => state.setStep3Data);
  const serverErrors = useProposalStore((state) => state.serverErrors);
  const setServerErrors = useProposalStore((state) => state.setServerErrors);
  const clearDraft = useProposalStore((state) => state.clearDraft);
  const [isPending, startTransition] = useTransition();

  const form = useForm<
    ProposalDetailFormInput,
    undefined,
    ProposalDetailFormValues
  >({
    defaultValues: { ...CREATE_DEFAULT_VALUES, ...step3Data },
    resolver: zodResolver(proposalDetailSchema),
  });

  // Re-hydrate form from store on client mount
  useEffect(() => {
    const handleHydration = (state: ProposalState) => {
      if (state && state.step3Data && Object.keys(state.step3Data).length > 0) {
        form.reset({ ...CREATE_DEFAULT_VALUES, ...state.step3Data });
      }
    };

    if (useProposalStore.persist.hasHydrated()) {
      handleHydration(useProposalStore.getState());
    }

    const unsub = useProposalStore.persist.onFinishHydration(handleHydration);
    return () => unsub();
  }, [form]);

  useEffect(() => {
    if (serverErrors && step === 3) {
      Object.entries(serverErrors).forEach(([field, messages]) => {
        form.setError(field as any, { type: "server", message: messages[0] });
      });
      setServerErrors(null);
    }
  }, [serverErrors, step, form, setServerErrors]);

  const onSubmit = (data: ProposalDetailFormValues) => {
    // 1. Simpan draft
    setStep3Data(data);

    // 2. Submit ke Server Action
    startTransition(async () => {
      const fd = getFormDataFromStore();
      const result = await createProposal(fd);

      if (!result.success) {
        toast.error(result.message);
        setServerErrors(result.errors || null);
        setStep(result.step!); // Kembali ke step yang error
      } else {
        toast.success(result.message);
        clearDraft();
        window.location.href = "/biofloc-thematic";
      }
    });
  };

  return {
    form,
    isPending,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
