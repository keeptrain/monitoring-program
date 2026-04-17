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

  const logs = await getIsfProgramLogsByStep(stepNumber);
  const data = logs.map((row) => ({ ...row, step_id: stepNumber }));
  return <IsfStepProgramPage step={stepNumber} data={data} />;
}
