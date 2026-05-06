import RevitalizationReportForm from "@/features/revitalisasi/forms/RevitalizationReportForm";
import { getRevitalizationProgramLogById } from "@/features/revitalisasi/actions/revitalization-program-logs";
import { notFound } from "next/navigation";

export default async function RevitalizationReportEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let report;
  try {
    report = await getRevitalizationProgramLogById(id);
  } catch (error) {
    console.error("Error loading revitalization report for edit:", error);
    return notFound();
  }

  const { data: reportData } = report;

  return (
    <RevitalizationReportForm areaId={reportData.area_id} initialData={reportData} />
  );
}
