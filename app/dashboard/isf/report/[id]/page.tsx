import IsfProgramLogDetail from "@/features/isf/components/IsfProgramLogDetail";
import { getIsfProgramLogById } from "@/features/isf/actions/isf-program-logs";
import { notFound } from "next/navigation";

export default async function IsfReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let data;
  try {
    data = await getIsfProgramLogById(id);
  } catch (error) {
    console.error("Error loading ISF report detail:", error);
    return notFound();
  }

  return <IsfProgramLogDetail data={data.data} />;
}
