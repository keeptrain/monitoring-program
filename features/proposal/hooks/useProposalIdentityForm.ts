"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { parseAsInteger, useQueryState } from "nuqs";
import {
  proposalIdentitySchema,
  ProposalIdentityInput,
  ProposalIdentityFormValues,
} from "../forms/proposal-identity-schema";
import { useEffect } from "react";
import { ProposalState, useProposalStore } from "../api/proposal-store";

const CREATE_DEFAULT_VALUES: ProposalIdentityInput = {
  name: "",
  nib: "",
  kusukaNumber: "",
  legalEntityNumber: "",
  chairmanName: "",
  chairmanPhoneNumber: "",
  companionName: "",
  companionPhoneNumber: "",
  boardMemberCount: "" as any,
  memberCount: "" as any,
};

export function useProposalIdentityForm(
  initialData?: Partial<ProposalIdentityInput>,
) {
  const [step, setStep] = useQueryState(
    "step",
    parseAsInteger.withDefault(1).withOptions({
      shallow: false,
      clearOnDefault: false,
    }),
  );

  const step1Data = useProposalStore((state) => state.step1Data);
  const setStep1Data = useProposalStore((state) => state.setStep1Data);
  const serverErrors = useProposalStore((state) => state.serverErrors);
  const setServerErrors = useProposalStore((state) => state.setServerErrors);

  const form = useForm<
    ProposalIdentityInput,
    undefined,
    ProposalIdentityFormValues
  >({
    resolver: zodResolver(proposalIdentitySchema),
    defaultValues: { ...CREATE_DEFAULT_VALUES, ...initialData, ...step1Data },
  });

  // Re-hydrate form from store or initialData on client mount
  useEffect(() => {
    const handleHydration = (state: ProposalState) => {
      const storeData = state.step1Data;
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
    let prevStep1Data = useProposalStore.getState().step1Data;

    const unsub = useProposalStore.subscribe((state) => {
      const newStep1Data = state.step1Data;
      if (newStep1Data === prevStep1Data) return;
      prevStep1Data = newStep1Data;

      const hasStoreData = newStep1Data && Object.keys(newStep1Data).length > 0;

      form.reset({
        ...CREATE_DEFAULT_VALUES,
        ...initialData,
        ...(hasStoreData ? newStep1Data : {}),
      });
    });

    return () => unsub();
  }, [form, initialData]);

  useEffect(() => {
    if (serverErrors && step === 1) {
      Object.entries(serverErrors).forEach(([field, messages]) => {
        form.setError(field as any, { type: "server", message: messages[0] });
      });
      setServerErrors(null);
    }
  }, [serverErrors, step, form, setServerErrors]);

  // 3. Handler Submit
  const onSubmit = (data: ProposalIdentityFormValues) => {
    setStep1Data(data);
    setStep(step + 1);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    step,
  };
}
