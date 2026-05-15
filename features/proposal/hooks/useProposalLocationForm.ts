import { useForm, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProposalLocationInput,
  ProposalLocationValues,
  proposalLocationSchema,
} from "../forms/proposal-location-schema";
import { useEffect } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { ProposalState, useProposalStore } from "../api/proposal-store";

const CREATE_DEFAULT_VALUES: DefaultValues<ProposalLocationInput> = {
  latitude: "" as any,
  longitude: "" as any,
  landSlope: "" as any,
  province_code: "",
  province_name: "",
  regency_code: "",
  regency_name: "",
  district_code: "",
  district_name: "",
  village_code: "",
  village_name: "",
};

export const useProposalLocationForm = (
  initialData?: Partial<ProposalLocationInput>,
  options?: { disableStore?: boolean },
) => {
  const disableStore = options?.disableStore ?? false;

  const [step, setStep] = useQueryState(
    "step",
    parseAsInteger.withDefault(2).withOptions({
      shallow: false,
      clearOnDefault: false,
    }),
  );

  const step2Data = useProposalStore((state) => state.step2Data);
  const setStep2Data = useProposalStore((state) => state.setStep2Data);
  const serverErrors = useProposalStore((state) => state.serverErrors);
  const setServerErrors = useProposalStore((state) => state.setServerErrors);

  const mergedDefaults = disableStore
    ? { ...CREATE_DEFAULT_VALUES, ...initialData }
    : { ...CREATE_DEFAULT_VALUES, ...initialData, ...step2Data };

  const form = useForm<ProposalLocationInput, undefined, ProposalLocationValues>({
    defaultValues: mergedDefaults,
    resolver: zodResolver(proposalLocationSchema),
  });

  // Re-hydrate form from store or initialData on client mount
  useEffect(() => {
    if (disableStore) return;

    const handleHydration = (state: ProposalState) => {
      const storeData = state.step2Data;
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
  }, [form, initialData, disableStore]);

  // Subscribe to store changes (e.g. clearDraft) to keep form in sync
  useEffect(() => {
    if (disableStore) return;

    let prevStep2Data = useProposalStore.getState().step2Data;

    const unsub = useProposalStore.subscribe((state) => {
      const newStep2Data = state.step2Data;
      if (newStep2Data === prevStep2Data) return;
      prevStep2Data = newStep2Data;

      const hasStoreData =
        newStep2Data && Object.keys(newStep2Data).length > 0;

      form.reset({
        ...CREATE_DEFAULT_VALUES,
        ...initialData,
        ...(hasStoreData ? newStep2Data : {}),
      });
    });

    return () => unsub();
  }, [form, initialData, disableStore]);

  useEffect(() => {
    if (disableStore) return;
    if (serverErrors && step === 2) {
      Object.entries(serverErrors).forEach(([field, messages]) => {
        form.setError(field as any, { type: "server", message: messages[0] });
      });
      setServerErrors(null);
    }
  }, [serverErrors, step, form, setServerErrors, disableStore]);

  const onSubmit = (data: ProposalLocationValues) => {
    if (!disableStore) {
      setStep2Data(data);
      setStep(step + 1);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
