import IsfProgramPage from "@/features/isf/IsfProgramPage";
import { getIsfStepSummaries } from "@/features/isf/actions/isf-program-logs";

export default async function Page() {
  const data = await getIsfStepSummaries();
  return <IsfProgramPage data={data} />;
}
