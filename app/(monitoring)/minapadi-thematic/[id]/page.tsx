import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";
import MonitoringThematicDetailPage from "@/features/monitoring/pages/MonitoringThematicDetailPage";

const breadcrumbList = [
  { label: "Monitoring", href: "/minapadi-thematic" },
  { label: "Tematik Minapadi" },
  { label: "Detail" },
];

/**
 * (public)/minapadi-thematic/[id]/page.tsx
 */
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="mx-auto my-6 max-w-6xl space-y-2">
      <BreadcrumbHeader items={breadcrumbList} />
      <MonitoringThematicDetailPage params={params} type="minapadi_thematic" />
    </div>
  );
}
