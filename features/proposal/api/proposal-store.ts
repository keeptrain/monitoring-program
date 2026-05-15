import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProposalDetailFormValues } from "../forms/proposal-detail-schema";
import { ProposalLocationValues } from "../forms/proposal-location-schema";
import { ProposalIdentityFormValues } from "../forms/proposal-identity-schema";

export interface ProposalState {
  step1Data: Partial<ProposalIdentityFormValues>;
  step2Data: Partial<ProposalLocationValues>;
  step3Data: Partial<ProposalDetailFormValues>;
  serverErrors: Record<string, string[]> | null;
  isSubmitting: boolean;
  setStep1Data: (data: Partial<ProposalIdentityFormValues>) => void;
  setStep2Data: (data: Partial<ProposalLocationValues>) => void;
  setStep3Data: (data: Partial<ProposalDetailFormValues>) => void;
  setServerErrors: (errors: Record<string, string[]> | null) => void;
  setIsSubmitting: (val: boolean) => void;
  clearDraft: () => void;
}

export const useProposalStore = create<ProposalState>()(
  persist(
    (set) => ({
      step1Data: {},
      step2Data: {},
      step3Data: {},
      serverErrors: null,
      isSubmitting: false,
      setStep1Data: (data) =>
        set((state) => ({ step1Data: { ...state.step1Data, ...data } })),
      setStep2Data: (data) =>
        set((state) => ({ step2Data: { ...state.step2Data, ...data } })),
      setStep3Data: (data) =>
        set((state) => ({ step3Data: { ...state.step3Data, ...data } })),
      setServerErrors: (errors) => set({ serverErrors: errors }),
      setIsSubmitting: (val) => set({ isSubmitting: val }),
      clearDraft: () =>
        set({
          step1Data: {},
          step2Data: {},
          step3Data: {},
          serverErrors: null,
          isSubmitting: false,
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
