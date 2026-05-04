import { getIsfPerMonthByZone } from "../actions/public-location";
import MonitoringDetailClient from "../components/MonitoringDetailClient";

export default async function MonitoringIsfDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getIsfPerMonthByZone(Number(id));

  return (
    <div className="mx-auto max-w-6xl">
      <MonitoringDetailClient data={data} />
    </div>
  );
}
