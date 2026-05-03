"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

interface StepNavigationProps {
  totalSteps: number;
  backHref: string;
}

export default function StepNavigation({ totalSteps }: StepNavigationProps) {
  const [step, setStep] = useQueryState(
    "step",
    parseAsInteger.withDefault(1).withOptions({
      shallow: false,
      clearOnDefault: false,
    }),
  );

  const isFirstStep = step === 1;
  const isLastStep = step === totalSteps;
  return (
    <>
      <Button
        disabled={isFirstStep}
        variant="ghost"
        onClick={() => !isFirstStep && setStep(step - 1)}
      >
        Sebelumnya
      </Button>

      <Button form={`step-${step}-form`}>
        {!isLastStep ? "Lanjut" : "Kirim"}
        <ArrowRightIcon className="size-4" />
      </Button>
    </>
  );
}
