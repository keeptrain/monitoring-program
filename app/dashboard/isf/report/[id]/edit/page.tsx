import IsfReportForm from "@/features/isf/forms/IsfReportForm";
import { getIsfProgramLogById } from "@/features/isf/actions/isf-program-logs";
import { notFound } from "next/navigation";

export default async function IsfReportEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reportId = Number(id);
  if (Number.isNaN(reportId)) {
    return notFound();
  }

  let report;
  try {
    report = await getIsfProgramLogById(reportId);
  } catch (error) {
    console.error("Error loading ISF report for edit:", error);
    return notFound();
  }

  const { data: reportData } = report;

  return (
    <IsfReportForm zone={String(reportData.step_id)} initialData={reportData} />
  );
}
