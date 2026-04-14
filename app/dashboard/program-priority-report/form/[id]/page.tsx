import Component from "@/features/dashboard/ProgramPriorityReportFormPage";
import { getAvailableLocations } from "@/features/dashboard/actions/available-locations";
import { getProgramPriorityReportById } from "@/features/dashboard/actions/program-priority-reports";
import { notFound } from "next/navigation";
import { ProgramPriorityFormInput } from "@/features/dashboard/forms/program-priority-schema";
import { ProgramPriorityReports } from "@/features/dashboard/actions/program-priority-reports";

export default async function ProgramPriorityReportFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isCreateMode = id === "create";
  const availableLocations = await getAvailableLocations();

  if (isCreateMode) {
    return <Component availableLocations={availableLocations} />;
  }

  const reportId = Number(id);
  if (Number.isNaN(reportId)) {
    return notFound();
  }

  let report: ProgramPriorityReports;
  try {
    report = await getProgramPriorityReportById(reportId);
  } catch (error) {
    console.error("Error loading report for edit:", error);
    return notFound();
  }

  const initialValues: ProgramPriorityFormInput = {
    available_location_id: report.available_location_id,
    name: report.name,
    provider_type:
      report.provider_type === "private" || report.provider_type === "institution"
        ? report.provider_type
        : undefined,
    percentage_of_work: report.percentage_of_work,
    status: report.status === "HUB" || report.status === "NON-HUB" ? report.status : undefined,
    constraints: report.constraints,
    follow_up: report.follow_up,
    documentations:
      report.documentations?.length > 0
        ? report.documentations.map((doc) => ({
            image_before_path: doc.image_before_path ?? "",
            image_after_path: doc.image_after_path ?? "",
          }))
        : [{ image_before_path: "", image_after_path: "" }],
  };

  return (
    <Component
      availableLocations={availableLocations}
      initialValues={initialValues}
      reportId={reportId}
    />
  );
}
