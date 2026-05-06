import RevitalizationReportForm from "@/features/revitalisasi/forms/RevitalizationReportForm";
import { notFound } from "next/navigation";
import { REVITALIZATION_AREAS } from "@/features/revitalisasi/constants/revitalization-area";

export default async function RevitalizationCreatePage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area: slug } = await params;

  const areaInfo = REVITALIZATION_AREAS.find((a) => a.slug === slug);

  if (!areaInfo) {
    return notFound();
  }

  return <RevitalizationReportForm areaId={areaInfo.id} />;
}
