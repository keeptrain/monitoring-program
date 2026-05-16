import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getMonitoringLocationDetail } from "@/features/monitoring/actions/public-location";
import { getSessionCached } from "@/features/auth/session";
import MonitoringThematicDetailClientPage from "./MonitoringThematicDetailClientPage";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressPieChart } from "@/features/monitoring/components/shared/ProgressPieChart";
import { DetailItem } from "@/components/shared/DetailItem";
import {
  MapPinIcon,
  TargetIcon,
  InfoIcon,
  UserIcon,
  CameraIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import DocumentationCarouselGallery from "@/components/shared/DocumentationCarouselGallery";
import { getDocumentationGroupsByTypeAndId } from "@/features/documentation/actions";

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
  const groups = await getDocumentationGroupsByTypeAndId(type, id);

  if (!result.data) {
    return notFound();
  }

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
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-start gap-2">
              <MapPinIcon className="size-4" />
              <p className="text-muted-foreground">
                {data.full_location || "Lokasi tidak diketahui"}
              </p>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2/3 — Map + Docs (client) */}
        <div className="lg:col-span-2">
          <MonitoringThematicDetailClientPage lat={lat} lng={lng} name={name} />
        </div>

        {/* Right 1/3 — Progress & Info (server rendered) */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <TargetIcon className="size-4" />
                Progres
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-4">
              <ProgressPieChart progress={data.progress_percent} size={144} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <InfoIcon className="size-4" />
                Informasi Program
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DetailItem
                label="Komoditas Bantuan"
                value={data.commodity_aid}
              />
              <DetailItem
                label="Komoditas Potensi"
                value={data.commodity_potential || "-"}
              />
              <DetailItem label="Luas Lahan" value={data.land_area} />
              <DetailItem label="Mitra SPPG" value={data.sppg_partner || "-"} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Authenticated-only sensitive info — server rendered */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <UserIcon className="size-4" />
              Informasi Sensitif (Internal)
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
              <DetailItem
                label="Jumlah Pengurus"
                value={`${entity?.board_member_count ?? 0} Orang`}
              />
              <DetailItem
                label="Jumlah Anggota"
                value={`${entity?.member_count ?? 0} Orang`}
              />
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Public membership info (when NOT authenticated) — server rendered */}
      {!isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <UserIcon className="size-4" />
              Informasi Keanggotaan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                label="Total Pengurus"
                value={`${entity?.board_member_count ?? 0} Orang`}
              />
              <DetailItem
                label="Total Anggota"
                value={`${entity?.member_count ?? 0} Orang`}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div className="space-y-4 pb-4">
        <div className="flex items-center gap-2">
          <CameraIcon className="size-4" />
          <h2 className="font-semibold">Dokumentasi</h2>
        </div>
        <div className="space-y-8">
          {groups.map((group, index) => (
            <div key={group.groupId ?? index} className="space-y-4">
              {index > 0 && (
                <div className="text-muted-foreground text-xs font-medium">
                  Periode {index + 1}
                </div>
              )}
              <DocumentationCarouselGallery type={type} id={id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
