import { REVITALIZATION_AREAS } from "@/features/revitalisasi/constants/revitalization-area";
import { getRevitalizationPerMonthByArea } from "../actions/monitoring-revitalization-actions";
import MonitoringRevitalizationDetailClient from "../components/revitalization-detail/MonitoringRevitalizationDetailClient";

export default async function MonitoringRevitalisasiDetailPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area } = await params;

  const areaInfo = REVITALIZATION_AREAS.find((a) => a.slug === area);

  if (!areaInfo) {
    return (
      <div className="mx-auto max-w-6xl">
        <p className="text-destructive">Area tidak ditemukan.</p>
      </div>
    );
  }

  const data = await getRevitalizationPerMonthByArea(areaInfo.id);

  return (
    <div className="mx-auto max-w-6xl">
      <MonitoringRevitalizationDetailClient data={data} />
    </div>
  );
}
