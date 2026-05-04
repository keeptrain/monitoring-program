import { useForm, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LocationKdmpInput,
  LocationKdmpValues,
  locationKdmpSchema,
} from "../forms/location-kdmp-schema";
import { useEffect } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { ProposalState, useProposalStore } from "../api/proposal-store";

const CREATE_DEFAULT_VALUES: DefaultValues<LocationKdmpInput> = {
  latitude: "",
  longitude: "",
  landSlope: "",
  province_code: "",
  province_name: "",
  regency_code: "",
  regency_name: "",
  district_code: "",
  district_name: "",
  village_code: "",
  village_name: "",
};

export const useLocationKdmpForm = () => {
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

  const form = useForm<LocationKdmpInput, undefined, LocationKdmpValues>({
    defaultValues: { ...CREATE_DEFAULT_VALUES, ...step2Data },
    resolver: zodResolver(locationKdmpSchema),
  });

  // Re-hydrate form from store on client mount
  useEffect(() => {
    const handleHydration = (state: ProposalState) => {
      if (state && state.step2Data && Object.keys(state.step2Data).length > 0) {
        form.reset({ ...CREATE_DEFAULT_VALUES, ...state.step2Data });
      }
    };

    if (useProposalStore.persist.hasHydrated()) {
      handleHydration(useProposalStore.getState());
    }

    const unsub = useProposalStore.persist.onFinishHydration(handleHydration);
    return () => unsub();
  }, [form]);

  useEffect(() => {
    if (serverErrors && step === 2) {
      Object.entries(serverErrors).forEach(([field, messages]) => {
        form.setError(field as any, { type: "server", message: messages[0] });
      });
      setServerErrors(null);
    }
  }, [serverErrors, step, form, setServerErrors]);

  const onSubmit = (data: LocationKdmpValues) => {
    setStep2Data(data);
    setStep(step + 1);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
