"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useIsMutating } from "@tanstack/react-query";
import { getDocumentationsUploadMutationKey } from "@/features/documentation/hooks/useDocumentationsUpload";

export default function StepNavigation({ totalSteps }: { totalSteps: number }) {
  const [step, setStep] = useQueryState(
    "step",
    parseAsInteger.withDefault(1).withOptions({
      shallow: false,
      clearOnDefault: false,
    }),
  );

  // Check if any documentation/proposal upload is in progress
  const isUploading = useIsMutating({
    mutationKey: getDocumentationsUploadMutationKey(),
  });

  const isFirstStep = step === 1;
  const isLastStep = step === totalSteps;
  const isNextDisabled = isUploading > 0;

  return (
    <>
      <Button
        disabled={isFirstStep || isNextDisabled}
        variant="ghost"
        onClick={() => !isFirstStep && setStep(step - 1)}
      >
        Sebelumnya
      </Button>

      <Button form={`step-${step}-form`} disabled={isNextDisabled}>
        {!isLastStep ? "Lanjut" : "Kirim"}
        <ArrowRightIcon className="size-4" />
      </Button>
    </>
  );
}
