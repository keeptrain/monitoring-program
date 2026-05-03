"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { parseAsInteger, useQueryState } from "nuqs";
import {
  identifyKdmpSchema,
  IdentifyKdmpInput,
  IdentifyKdmpFormValues,
} from "../forms/identify-kdmp-schema";
import { useEffect } from "react";
import { useProposalStore } from "../proposal-store";

const CREATE_DEFAULT_VALUES: IdentifyKdmpInput = {
  name: "",
  nib: "",
  kusukaNumber: "",
  legalEntityNumber: "",
  chairmanName: "",
  chairmanPhoneNumber: "",
  companionName: "",
  companionPhoneNumber: "",
  boardMemberCount: undefined,
  memberCount: undefined,
};

export function useIdentifyKdmpForm() {
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

  const form = useForm<IdentifyKdmpInput, undefined, IdentifyKdmpFormValues>({
    resolver: zodResolver(identifyKdmpSchema),
    defaultValues: { ...CREATE_DEFAULT_VALUES, ...step1Data },
  });

  // Re-hydrate form from store on client mount
  useEffect(() => {
    const handleHydration = (state: any) => {
      if (state && state.step1Data && Object.keys(state.step1Data).length > 0) {
        form.reset({ ...CREATE_DEFAULT_VALUES, ...state.step1Data });
      }
    };

    // Jika sudah selesai hydrate sebelum useEffect jalan (sering terjadi)
    if (useProposalStore.persist.hasHydrated()) {
      handleHydration(useProposalStore.getState());
    }

    // Listener jika hydrate butuh waktu ekstra
    const unsub = useProposalStore.persist.onFinishHydration(handleHydration);

    return () => unsub();
  }, [form]);

  useEffect(() => {
    if (serverErrors && step === 1) {
      Object.entries(serverErrors).forEach(([field, messages]) => {
        form.setError(field as any, { type: "server", message: messages[0] });
      });
      setServerErrors(null);
    }
  }, [serverErrors, step, form, setServerErrors]);

  // 3. Handler Submit
  const onSubmit = (data: IdentifyKdmpFormValues) => {
    setStep1Data(data);
    setStep(step + 1);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    step,
  };
}
