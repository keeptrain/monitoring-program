"use client";

import { useEffect } from "react";
import { useProposalStore } from "../api/proposal-store";
import { useQueryState, parseAsInteger } from "nuqs";
import { useSearchParams } from "next/navigation";

export default function DraftHandler() {
  const clearDraft = useProposalStore((state) => state.clearDraft);
  const searchParams = useSearchParams();
  const [, setStep] = useQueryState(
    "step",
    parseAsInteger.withDefault(1).withOptions({
      shallow: false,
      clearOnDefault: false,
    }),
  );

  useEffect(() => {
    const hasStepParam = searchParams.has("step");

    if (!hasStepParam) {
      // Jika tidak ada parameter step, berarti user baru masuk dari tombol Header
      clearDraft();

      // Paksa set step=1 secara eksplisit agar tersimpan di URL
      setStep(1);
    }
  }, [searchParams, clearDraft, setStep]);

  return null;
}
