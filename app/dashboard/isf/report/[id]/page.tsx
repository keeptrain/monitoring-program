import IsfProgramLogDetail from "@/features/isf/components/IsfProgramLogDetail";
import { getIsfProgramLogById } from "@/features/isf/actions/isf-program-logs";
import { notFound } from "next/navigation";

export default async function IsfReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reportId = Number(id);
  if (Number.isNaN(reportId)) {
    return notFound();
  }

  let data;
  try {
    data = await getIsfProgramLogById(reportId);
  } catch (error) {
    console.error("Error loading ISF report detail:", error);
    return notFound();
  }

  return <IsfProgramLogDetail data={data.data} />;
}
