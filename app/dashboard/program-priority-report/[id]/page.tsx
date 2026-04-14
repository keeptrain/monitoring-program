import { getProgramPriorityReportById } from "@/features/dashboard/actions/program-priority-reports";
import ProgramPriorityReportDetailPage from "@/features/dashboard/ProgramPriorityReportDetailPage";
import { notFound } from "next/navigation";
import { ProgramPriorityReportDetail } from "@/features/dashboard/actions/program-priority-reports";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (Number.isNaN(numericId)) {
    return notFound();
  }

  let data: ProgramPriorityReportDetail;

  try {
    data = await getProgramPriorityReportById(numericId);
  } catch (error) {
    console.error("Error loading report detail:", error);
    return notFound();
  }

  if (!data) {
    return notFound();
  }

  return <ProgramPriorityReportDetailPage data={data} />;
}
