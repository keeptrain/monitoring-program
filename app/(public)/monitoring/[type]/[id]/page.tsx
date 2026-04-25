import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { STEPS } from "@/features/isf/constants/isf-step";
import { ArrowLeftIcon, MapPinIcon } from "lucide-react";
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
    resolveId: (id: string) => number | null;
    getSubtitle: (data: any, resolvedId: number) => string | undefined;
    getLocation?: (data: any) => string | undefined;
  }
> = {
  biofloc_thematic: {
    title: "Tematik Bioflok",
    Component: LazyMonitoringBioflocDetail,
    query: getPublicBiofloc,
    resolveId: (id) => (isNaN(parseInt(id, 10)) ? null : parseInt(id, 10)),
    getSubtitle: (data) => data?.data?.name,
    getLocation: (data) => data?.data?.land_area,
  },
  isf: {
    title: "Integrated Shrimp Farming",
    Component: LazyMonitoringDetailClient,
    query: getIsfPerMonthByZone,
    resolveId: (id) => {
      const match = id.match(/^zona([1-7])$/);
      return match ? parseInt(match[1], 10) : null;
    },
    getSubtitle: (_, resolvedId) =>
      STEPS.find((s) => s.id === resolvedId)?.name,
  },
  minapadi_thematic: {
    title: "Mina Padi Thematic",
    resolveId: (id) => (isNaN(parseInt(id, 10)) ? null : parseInt(id, 10)),
    getSubtitle: (data) => data?.data?.name,
  },
  revitalization: {
    title: "Revitalisasi",
    resolveId: (id) => (isNaN(parseInt(id, 10)) ? null : parseInt(id, 10)),
    getSubtitle: (data) => data?.data?.name,
  },
};

type Props = {
  params: Promise<{
    type: string;
    id: string;
  }>;
};

export default async function PublicMonitoringDetailPage({ params }: Props) {
  const { type: rawType, id: rawId } = await params;

  // Mapping URL type (dashes) to internal type (underscores)
  const typeMap: Record<string, LocationType> = {
    "biofloc-thematic": "biofloc_thematic",
    "minapadi-thematic": "minapadi_thematic",
  };

  const type = typeMap[rawType] || (rawType as LocationType);
  const config = DETAIL_CONTENT[type];

  // 1. Validasi Tipe
  if (!config) return notFound();

  // 2. Resolving ID (Zona vs ID Numerik)
  const resolvedId = config.resolveId(rawId);
  if (resolvedId === null) return notFound();

  // 3. Fetch Data
  const data = config.query
    ? await config.query(resolvedId).catch(() => null)
    : null;

  // 4. Validasi Data (Jika query ada tapi data kosong -> 404)
  if (
    config.query &&
    (!data || (Array.isArray(data.data) ? data.data.length === 0 : !data.data))
  ) {
    return notFound();
  }

  const subtitle = config.getSubtitle(data, resolvedId);
  const locationPath = config.getLocation?.(data);

  return (
    <main className="py-6 md:py-10">
      <div className="mx-auto max-w-6xl space-y-4 px-4 sm:px-0">
        {/* Header */}
        <div className="space-y-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeftIcon className="size-4" />
              Kembali
            </Link>
          </Button>

          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {config.title}
            </p>
            <div className="flex flex-col gap-0 md:flex-row md:items-center md:gap-3">
              {type === "isf" && (
                <h1 className="text-muted-foreground text-xl font-semibold">
                  Zona {resolvedId}:
                </h1>
              )}
              <p className="text-primary text-xl font-bold tracking-wider uppercase">
                {subtitle || config.title}
              </p>
            </div>

            {locationPath && (
              <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm font-medium">
                <MapPinIcon className="size-4 shrink-0" />
                <p className="line-clamp-1">{locationPath}</p>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-8">
          {config.Component ? (
            <config.Component data={data} />
          ) : (
            <div className="bg-muted flex h-40 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground text-sm italic">
                Detail konten untuk {config.title} sedang dalam pengembangan.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
