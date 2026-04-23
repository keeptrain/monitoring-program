import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { STEPS } from "@/features/isf/constants/isf-step";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { LocationType } from "@/features/dashboard/actions/available-locations";
import dynamic from "next/dynamic";
import {
  getIsfPerMonthByZone,
  getPublicBiofloc,
} from "@/features/monitoring/actions/public-location";

const LazyMonitoringDetailClient = dynamic(
  () => import("@/features/monitoring/components/MonitoringDetailClient"),
);

const LazyMonitoringBioflocDetail = dynamic(
  () => import("@/features/monitoring/pages/BioflocDetailPage"),
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
    Component: LazyMonitoringBioflocDetail,
    title: "TematikBioflok",
    query: getPublicBiofloc,
  },
  minapadi_thematic: {
    title: "Mina Padi Thematic",
  },
  revitalization: {
    title: "Revitalisasi",
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

  if (!config) {
    return notFound();
  }

  // Khusus ISF menggunakan pola zona1-zona7
  // Tipe lain (seperti biofloc) menggunakan ID numerik langsung
  const isIsf = type === "isf";
  const zoneMatch = id.match(/^zona([1-7])$/);
  const mappedNonIsfId = parseInt(id, 10);

  if (isIsf && !zoneMatch) {
    return notFound();
  }
  if (!isIsf && Number.isNaN(mappedNonIsfId)) {
    return notFound();
  }

  const resolvedId = isIsf ? parseInt(zoneMatch![1], 10) : mappedNonIsfId;
  const currentStep = isIsf ? STEPS.find((s) => s.id === resolvedId) : null;

  // Ambil data awal di Server jika query tersedia
  const logsData = config.query
    ? await config.query(resolvedId).catch(() => null)
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
              {isIsf && (
                <h1 className="text-muted-foreground text-xl font-semibold">
                  Zona {resolvedId}:
                </h1>
              )}
              <p className="text-primary text-xl font-bold tracking-wider uppercase">
                {isIsf ? currentStep?.name : config.title}
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
