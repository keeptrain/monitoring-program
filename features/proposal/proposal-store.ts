import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProposalDetailFormValues } from "./forms/proposal-detail-schema";
import { LocationKdmpValues } from "./forms/location-kdmp-schema";
import { IdentifyKdmpFormValues } from "./forms/identify-kdmp-schema";

interface ProposalState {
  step1Data: Partial<IdentifyKdmpFormValues>;
  step2Data: Partial<LocationKdmpValues>;
  step3Data: Partial<ProposalDetailFormValues>;
  serverErrors: Record<string, string[]> | null;
  setStep1Data: (data: Partial<IdentifyKdmpFormValues>) => void;
  setStep2Data: (data: Partial<LocationKdmpValues>) => void;
  setStep3Data: (data: Partial<ProposalDetailFormValues>) => void;
  setServerErrors: (errors: Record<string, string[]> | null) => void;
  clearDraft: () => void;
}

export const useProposalStore = create<ProposalState>()(
  persist(
    (set) => ({
      step1Data: {},
      step2Data: {},
      step3Data: {},
      serverErrors: null,
      setStep1Data: (data) =>
        set((state) => ({ step1Data: { ...state.step1Data, ...data } })),
      setStep2Data: (data) =>
        set((state) => ({ step2Data: { ...state.step2Data, ...data } })),
      setStep3Data: (data) =>
        set((state) => ({ step3Data: { ...state.step3Data, ...data } })),
      setServerErrors: (errors) => set({ serverErrors: errors }),
      clearDraft: () =>
        set({
          step1Data: {},
          step2Data: {},
          step3Data: {},
          serverErrors: null,
        }),
    }),
    {
      name: "proposal-draft-storage",
    },
  ),
);

export const getFormDataFromStore = () => {
  const fd = new FormData();
  const { step1Data, step2Data, step3Data } = useProposalStore.getState();

  const allData = { ...step1Data, ...step2Data, ...step3Data };

  Object.entries(allData).forEach(([key, value]) => {
    if (key === "documentations") {
      fd.append(key, JSON.stringify(value));
    } else if (Array.isArray(value)) {
      value.forEach((v) => fd.append(key, String(v)));
    } else if (value !== undefined && value !== null && value !== "") {
      fd.append(key, String(value));
    }
  });

  return fd;
};
