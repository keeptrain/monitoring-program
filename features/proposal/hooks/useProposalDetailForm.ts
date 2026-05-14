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
import {
  createProposal,
  updateRevisionProposal,
} from "../api/proposal-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CREATE_DEFAULT_VALUES: DefaultValues<ProposalDetailFormInput> = {
  has_letter_of_land_preparation_and_use: undefined,
  proposed_commodity: undefined,
  has_member_with_experience: undefined,
  commodity_potentials: [],
  other_commodity_potential: "",
  proposal_path: "",
  documentations: [{ image_before_paths: [] }],
};

export const useProposalDetailForm = (
  initialData: Partial<ProposalDetailFormInput> | undefined,
  proposalId: string | undefined,
  basePath: string,
) => {
  const router = useRouter();
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
    defaultValues: { ...CREATE_DEFAULT_VALUES, ...initialData, ...step3Data },
    resolver: zodResolver(proposalDetailSchema),
  });

  // Re-hydrate form from store or initialData on client mount
  useEffect(() => {
    const handleHydration = (state: ProposalState) => {
      const storeData = state.step3Data;
      const hasStoreData = storeData && Object.keys(storeData).length > 0;

      // Always reset so old data is cleared when store is emptied
      form.reset({
        ...CREATE_DEFAULT_VALUES,
        ...initialData,
        ...(hasStoreData ? storeData : {}),
      });
    };

    if (useProposalStore.persist.hasHydrated()) {
      handleHydration(useProposalStore.getState());
    }

    const unsub = useProposalStore.persist.onFinishHydration(handleHydration);
    return () => unsub();
  }, [form, initialData]);

  // Subscribe to store changes (e.g. clearDraft) to keep form in sync
  useEffect(() => {
    let prevStep3Data = useProposalStore.getState().step3Data;

    const unsub = useProposalStore.subscribe((state) => {
      const newStep3Data = state.step3Data;
      if (newStep3Data === prevStep3Data) return;
      prevStep3Data = newStep3Data;

      const hasStoreData = newStep3Data && Object.keys(newStep3Data).length > 0;

      form.reset({
        ...CREATE_DEFAULT_VALUES,
        ...initialData,
        ...(hasStoreData ? newStep3Data : {}),
      });
    });

    return () => unsub();
  }, [form, initialData]);

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

      const result = proposalId
        ? await updateRevisionProposal(proposalId, fd)
        : await createProposal(fd);

      if (!result.success) {
        toast.error(result.message);
        setServerErrors(result.errors || null);
        setStep(result.step!); // Kembali ke step yang error
      } else {
        toast.success(result.message);
        clearDraft();
        router.push(basePath);
      }
    });
  };

  return {
    form,
    isPending,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
