import IsfStepProgramPage from "@/features/isf/IsfStepProgramPage";
import { getIsfProgramLogsByStep } from "@/features/isf/actions/isf-program-logs";
import { notFound } from "next/navigation";

export default async function IsfStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  const stepNumber = Number(step);
  if (Number.isNaN(stepNumber) || stepNumber < 1 || stepNumber > 7) {
    return notFound();
  }

  const result = await getIsfProgramLogsByStep(stepNumber);
  return (
    <IsfStepProgramPage
      step={stepNumber}
      data={result.data}
      availableDate={result.availableDate}
    />
  );
}
