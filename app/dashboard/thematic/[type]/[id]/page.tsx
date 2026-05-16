import MonitoringThematicDetailPage from "@/features/monitoring/pages/MonitoringThematicDetailPage";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";
import { notFound } from "next/navigation";

export default async function ThematicDashboardDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type: rawType, id } = await params;

  // Map URL type to component type
  const typeMap: Record<string, "biofloc_thematic" | "minapadi_thematic"> = {
    biofloc: "biofloc_thematic",
    minapadi: "minapadi_thematic",
  };

  const type = typeMap[rawType];

  if (!type) {
    return notFound();
  }

  const breadcrumbList = [
    { label: "Dashboard", href: "/dashboard" },
    {
      label: `Tematik ${rawType === "biofloc" ? "Bioflok" : "Minapadi"}`,
      href: `/dashboard/thematic/${rawType}`,
    },
    { label: "Detail" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <BreadcrumbHeader items={breadcrumbList} />
      <MonitoringThematicDetailPage
        params={Promise.resolve({ id })}
        type={type}
      />
    </div>
  );
}
