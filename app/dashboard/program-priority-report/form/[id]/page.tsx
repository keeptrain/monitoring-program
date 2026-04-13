import Component from "@/features/dashboard/ProgramPriorityReportFormPage";

export default async function ProgramPriorityReportFormPage({
  params,
}: {
  params: { id: string };
}) {
  const isCreateMode = params.id === "create";
  return <Component />;
}
