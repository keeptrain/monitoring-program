import IsfStepProgramPage from "@/features/isf/IsfStepProgramPage";

export default function IsfStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  return <IsfStepProgramPage params={params} />;
}
