import Component from "@/features/dashboard/ProgramPriorityReportFormPage";
import { getAvailableLocations } from "@/features/dashboard/actions/available-locations";

export default async function ProgramPriorityReportFormPage({
  params,
}: {
  params: { id: string };
}) {
  const isCreateMode = params.id === "create";
  const availableLocations = await getAvailableLocations();

  return <Component availableLocations={availableLocations} />;
}
