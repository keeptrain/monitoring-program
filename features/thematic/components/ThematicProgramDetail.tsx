import { ThematicProgramDetail } from "../types/thematic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateWithTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DocumentationGallery } from "@/components/shared/DocumentationGallery";
import { LinkBackButton } from "@/components/shared/LinkBackButton";
import {
  MapPin,
  Leaf,
  Users,
  Truck,
  Building2,
  CalendarDays,
  Percent,
  CameraIcon,
  ChartAreaIcon,
  PencilIcon,
} from "lucide-react";

export function ThematicProgramDetailComponent({
  data,
}: {
  data: ThematicProgramDetail;
}) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
            Dashboard / Tematik / Detail
          </p>
          <div className="flex items-center gap-2">
            <LinkBackButton href="/dashboard/thematic" />
            <h1 className="text-foreground text-2xl font-semibold tracking-tight">
              {data.name}
            </h1>
          </div>
          <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {data.available_locations?.name || "Lokasi tidak diketahui"}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {formatDateWithTime(data.updated_at)}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/thematic/form/${data.id}`}>
              <PencilIcon /> Ubah Data
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main content - 2/3 width on md+ */}
        <div className="space-y-6 md:col-span-2">
          {/* Card: Kurva S */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartAreaIcon className="size-5" />
                Kurva S
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder */}
              <div className="flex items-center justify-center">
                <p className="text-muted-foreground">Kurva S belum tersedia</p>
              </div>
            </CardContent>
          </Card>

          {/* Card: Dokumentasi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CameraIcon className="size-5" />
                Dokumentasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentationGallery documentations={data.documentations} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar content - 1/3 width on md+ */}
        <div className="space-y-6 lg:sticky lg:top-6">
          {/* Card: Status & Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Status Program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                    <Percent className="size-4" /> Capaian
                  </span>
                  <span className="font-semibold">
                    {data.progress_percent}%
                  </span>
                </div>
                <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full transition-all duration-500 ease-in-out"
                    style={{ width: `${data.progress_percent}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Informasi Detail */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Detail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailItem
                icon={<Leaf className="text-muted-foreground size-4" />}
                label="Komoditas Bantuan"
                value={data.commodity_aid}
              />
              <DetailItem
                icon={<Leaf className="text-muted-foreground size-4" />}
                label="Komoditas Potensi"
                value={data.commodity_potential || "-"}
              />
              <DetailItem
                icon={<MapPin className="text-muted-foreground size-4" />}
                label="Luas Lahan"
                value={data.land_area}
              />
              <DetailItem
                icon={<Building2 className="text-muted-foreground size-4" />}
                label="Produksi"
                value={data.production_value}
              />
              <DetailItem
                icon={<Users className="text-muted-foreground size-4" />}
                label="Jumlah Pengurus"
                value={data.total_management?.toString() || "0"}
              />
              <DetailItem
                icon={<Users className="text-muted-foreground size-4" />}
                label="Jumlah Anggota"
                value={data.total_members?.toString() || "0"}
              />
              <DetailItem
                icon={<Truck className="text-muted-foreground size-4" />}
                label="Jumlah Distribusi"
                value={data.distribution_amount?.toString() || "0"}
              />
              <DetailItem
                icon={<Building2 className="text-muted-foreground size-4" />}
                label="Mitra SPPG"
                value={data.sppg_partner}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
        {icon}
        {label}
      </div>
      <div className="text-sm font-medium">{value || "-"}</div>
    </div>
  );
}
