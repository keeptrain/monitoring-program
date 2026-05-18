import {
  MapPinIcon,
  InfoIcon,
  UserIcon,
  CameraIcon,
  PercentIcon,
  LayersIcon,
  ChartAreaIcon,
  FileXIcon,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getMonitoringLocationDetail } from "@/features/monitoring/actions/public-location";
import { getSessionCached } from "@/features/auth/session";
import MonitoringThematicDetailClientPage from "./MonitoringThematicDetailClientPage";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressPieChart } from "@/features/monitoring/components/shared/ProgressPieChart";
import { DetailItem } from "@/components/shared/DetailItem";
import { Separator } from "@/components/ui/separator";
import { DocumentationGroupGallery } from "@/features/monitoring/components/DocumentationGroupGallery";
import SCurveDownloadButton from "@/features/thematic/components/SCurveDownloadButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { THEMATIC_CONFIG } from "@/features/thematic/constants/thematic-constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MonitoringThematicDetailPage({
  params,
  type,
}: {
  params: Promise<{ id: string }>;
  type: "biofloc_thematic" | "minapadi_thematic";
}) {
  return (
    <Suspense fallback={<FullPageSkeleton />}>
      <MonitoringThematicDetailContent params={params} type={type} />
    </Suspense>
  );
}

async function MonitoringThematicDetailContent({
  params,
  type,
}: {
  params: Promise<{ id: string }>;
  type: "biofloc_thematic" | "minapadi_thematic";
}) {
  const { id } = await params;
  const session = await getSessionCached();
  const isAuthenticated = session.isLoggedIn;

  const result = await getMonitoringLocationDetail(type, id);

  if (!result.data) {
    return notFound();
  }

  const config = THEMATIC_CONFIG[type];

  const data = result.data;
  const location = data.available_locations;
  const entity = data.kdmp_entities;

  const lat = location?.latitude ?? 0;
  const lng = location?.longitude ?? 0;
  const name = entity?.name ?? "Tidak Diketahui";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header — server rendered */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-foreground text-lg font-semibold tracking-tight md:text-xl">
            {name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <MapPinIcon className="size-4" />
            <p className="text-muted-foreground">
              {data.full_location || "Lokasi tidak diketahui"}
            </p>
          </div>
        </div>
      </div>
      {data.proposal_id && (
        <Alert>
          <InfoIcon />
          <AlertTitle>Informasi {config.legendLabel}</AlertTitle>
          <AlertDescription>
            Program ini lewat melalui proposal, silahkan lihat detailnya{" "}
            <Button variant="link" className="h-fit p-0" asChild>
              <Link
                href={`${config.basePath}/proposal/${data.proposal_id}/detail`}
              >
                di sini
              </Link>
            </Button>
            .
          </AlertDescription>
        </Alert>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2/3 — Map (client) */}
        <div className="space-y-6 lg:col-span-2">
          <MonitoringThematicDetailClientPage lat={lat} lng={lng} name={name} />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayersIcon className="size-4" />
                Data Siklus
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3">
              <DetailItem label="Padat Tebar" value={"-"} />
              <DetailItem label="Jumlah Tebar" value={"-"} />
              <DetailItem label="Jumlah Panen" value={"-"} />
            </CardContent>
          </Card>
        </div>

        {/* Right 1/3 — Progress & Info (server rendered) */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PercentIcon className="size-4" />
                Progres
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ProgressPieChart progress={data.progress_percent} size={144} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <InfoIcon className="size-4" />
                Informasi Program
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DetailItem
                label="Komoditas Bantuan"
                value={
                  <span className="capitalize">
                    {data.commodity_aid || "-"}
                  </span>
                }
              />
              <DetailItem
                label="Komoditas Potensi"
                value={
                  <span className="capitalize">
                    {data.commodity_potential || "-"}
                  </span>
                }
              />
              <DetailItem label="Luas Lahan" value={data.land_area} />
              <DetailItem
                label="Nilai Produksi"
                value={data.production_value || "-"}
              />
              <DetailItem
                label="Jumlah Distribusi"
                value={
                  data.distribution_amount
                    ? `Rp ${data.distribution_amount.toLocaleString("id-ID")}`
                    : "-"
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Public membership & production info — server rendered */}
      <div className="col-span-3 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <UserIcon className="size-4" />
              Informasi Kelembagaan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <DetailItem
                label="Total Pengurus"
                value={`${entity?.board_member_count ?? 0} Orang`}
              />
              <DetailItem
                label="Total Anggota"
                value={`${entity?.member_count ?? 0} Orang`}
              />

              <DetailItem label="Mitra SPPG" value={data.sppg_partner || "-"} />
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartAreaIcon className="size-4" />
              Kurva S
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.s_curve_path ? (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-sm">
                  Berkas tersedia untuk diunduh.
                </p>
                <SCurveDownloadButton id={data.id} />
              </div>
            ) : (
              <div className="bg-muted/20 flex h-15 items-center justify-center gap-2 border">
                <FileXIcon className="text-muted-foreground size-4" />
                <p className="text-muted-foreground text-xs italic">
                  Belum diunggah
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Authenticated-only sensitive info — server rendered */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <UserIcon className="size-4" />
              Informasi Internal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <DetailItem
                label="Nomor KUSUKA"
                value={entity?.kusuka_number ?? "-"}
              />
              <DetailItem label="NIB" value={entity?.nib ?? "-"} />
              <DetailItem
                label="Nama Badan Hukum"
                value={entity?.legal_entity_number ?? "-"}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CameraIcon className="size-4" />
          <h2 className="font-semibold">Dokumentasi</h2>
        </div>
        <DocumentationGroupGallery type={type} id={id} />
      </div>
    </div>
  );
}

function FullPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Map Skeleton */}
          <Skeleton className="aspect-video w-full rounded-lg" />
        </div>

        <div className="space-y-6">
          {/* Cards Skeleton */}
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>

      {/* Info Sensitive Skeleton */}
      <Skeleton className="h-48 w-full rounded-xl" />

      {/* Documentation Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="aspect-square w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
