import MonitoringThematicDetailPage from "@/features/monitoring/pages/MonitoringThematicDetailPage";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";

const breadcrumbList = [
  { label: "Monitoring", href: "/biofloc-thematic" },
  { label: "Tematik Bioflok" },
  { label: "Detail" },
];

export default async function PublicBioflocDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="mx-auto my-6 max-w-6xl space-y-2">
      <BreadcrumbHeader items={breadcrumbList} />
      <MonitoringThematicDetailPage params={params} type="biofloc_thematic" />
    </div>
  );
}
