import { notFound } from "next/navigation";
import { getPublicThematicProgram } from "@/features/thematic/actions/public-thematic-programs";
import { MapPinIcon, InfoIcon, TargetIcon, UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressPieChart } from "@/features/monitoring/components/shared/ProgressPieChart";
import DocumentationCarouselGallery from "@/components/shared/DocumentationCarouselGallery";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";

const breadcrumbList = [
  { label: "Monitoring", href: "/monitoring" },
  { label: "Tematik Bioflok" },
  { label: "Detail" },
];

export default async function PublicBioflocDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const program = await getPublicThematicProgram(id);

  if (!program) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <BreadcrumbHeader items={breadcrumbList} />
          <div className="flex items-center gap-1">
            <h1 className="text-foreground text-lg font-semibold tracking-tight md:text-xl">
              {program.name}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-start gap-2">
              <MapPinIcon className="size-4" />
              <p className="text-muted-foreground">
                {program.available_locations?.name || "Lokasi tidak diketahui"}
              </p>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Progress Card */}
        <Card className="rounded-none md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TargetIcon className="size-4" />
              Capaian Progres
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <ProgressPieChart progress={program.progress_percent} size={144} />
            <p className="text-muted-foreground mt-4 text-sm font-semibold">
              {program.progress_percent}% Selesai
            </p>
          </CardContent>
        </Card>

        {/* Info Detail Card */}
        <Card className="rounded-none md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <InfoIcon className="size-4" />
              Informasi Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                label="Komoditas Bantuan"
                value={program.commodity_aid}
              />
              <DetailItem
                label="Komoditas Potensi"
                value={program.commodity_potential || "-"}
              />
              <DetailItem label="Luas Lahan" value={program.land_area} />
              <DetailItem
                label="Mitra SPPG"
                value={program.sppg_partner || "-"}
              />
              <DetailItem
                label="Nilai Produksi"
                value={program.production_value || "-"}
              />
              <DetailItem
                label="Jumlah Bantuan"
                value={
                  program.distribution_amount
                    ? `Rp ${program.distribution_amount.toLocaleString("id-ID")}`
                    : "-"
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Keanggotaan */}
        <Card className="rounded-none md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <UserIcon className="size-4" />
              Informasi Keanggotaan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <DetailItem
                label="Total Pengurus"
                value={`${program.total_management} Orang`}
              />
              <DetailItem
                label="Total Anggota"
                value={`${program.total_members} Orang`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dokumentasi */}
        <div className="md:col-span-3">
          <h2 className="mb-4 text-lg font-semibold">Galeri Dokumentasi</h2>
          <DocumentationCarouselGallery
            type="biofloc_thematic"
            id={program.id}
          />
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col gap-1 p-2">
      <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
        {label}
      </span>
      <span className="text-foreground text-sm font-semibold">
        {value ?? "-"}
      </span>
    </div>
  );
}
