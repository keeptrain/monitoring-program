import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { STEPS } from "@/features/isf/constants/isf-step";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { LocationType } from "@/features/dashboard/actions/available-locations";
import dynamic from "next/dynamic";
import { getIsfPerMonthByZone } from "@/features/monitoring/actions/public-location";

const LazyMonitoringDetailClient = dynamic(
  () => import("@/features/monitoring/components/MonitoringDetailClient"),
);

const DETAIL_CONTENT: Record<
  LocationType,
  {
    title: string;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    Component?: React.ComponentType<{ data: any }>;
    query?: (id: number) => Promise<any>;
  }
> = {
  isf: {
    Component: LazyMonitoringDetailClient,
    title: "Integrated Shrimp Farming",
    query: getIsfPerMonthByZone,
  },
  biofloc_thematic: {
    title: "Budidaya Ikan Bioflok",
  },
  minapadi_thematic: {
    title: "Mina Padi Thematic",
  },
};

type Props = {
  params: Promise<{
    type: string;
    id: string;
  }>;
};

export default async function MonitoringDetailPage({ params }: Props) {
  const { type, id } = await params;

  // Validasi apakah tipe tersedia di konfigurasi
  const config = DETAIL_CONTENT[type as keyof typeof DETAIL_CONTENT];

  // Validasi ID (zona1 - zona7)
  const zoneMatch = id.match(/^zona([1-7])$/);

  if (!config || !zoneMatch) {
    return notFound();
  }

  const zoneNumber = parseInt(zoneMatch[1], 10);
  const currentStep = STEPS.find((s) => s.id === zoneNumber);

  // Ambil data awal di Server jika query tersedia
  const logsData = config.query
    ? await config.query(zoneNumber).catch(() => null)
    : null;

  return (
    <main className="py-6 md:py-10">
      <div className="mx-auto max-w-6xl space-y-4 px-4 sm:px-0">
        {/* Header */}
        <div className="space-y-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/monitoring">
              <ArrowLeftIcon className="size-4" />
              Kembali
            </Link>
          </Button>
          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {config.title}
            </p>
            <div className="flex flex-col gap-0 md:flex-row md:items-center md:gap-2">
              <h1 className="text-muted-foreground text-xl font-semibold">
                Zona {zoneNumber}:
              </h1>
              <p className="text-primary text-xl font-bold tracking-wider uppercase">
                {currentStep?.name || config.title}
              </p>
            </div>
          </div>
        </div>

        {/* Client Side Content */}
        {config.Component && <config.Component data={logsData} />}
      </div>
    </main>
  );
}
