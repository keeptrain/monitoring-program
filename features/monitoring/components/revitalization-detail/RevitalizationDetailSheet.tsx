import DocumentationCarouselGallery from "@/components/shared/DocumentationCarouselGallery";
import { RevitalizationReportDatePicker } from "./RevitalizationReportDatePicker";
import { RevitalizationDetailSheet as RevitalizationAreaType } from "../../types/monitoring-types";
import MetrictsSnapshot from "../shared/MetrictsSnapshot";
import { SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRightIcon,
  PackageIcon,
  ScaleIcon,
  MapPinIcon,
  DownloadIcon,
  FileImageIcon,
} from "lucide-react";
import { toPreviewUrl } from "@/lib/utils";

export default function RevitalizationDetailSheet({
  data,
  areaSlug,
}: {
  data: RevitalizationAreaType;
  areaSlug: string;
}) {
  return (
    <div className="flex h-full flex-col overflow-scroll">
      {/* Scrollable Content */}
      <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-8">
        {/* Last Update & Date Picker */}
        <LastUpdateStatus
          areaId={data.area_id}
          progressDate={data.progress_date}
          onReportSelect={(id) => console.log("Selected report:", id)}
        />

        <MetrictsSnapshot
          progressPercent={data.progress_percent}
          totalWorker={data.total_worker}
        >
          <div className="flex flex-col">
            <div className="space-y-3">
              <p className="text-muted-foreground text-xs tracking-widest uppercase">
                Produksi
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <PackageIcon className="size-6 text-emerald-500" />
                  <div>
                    <p className="text-xl font-bold">{data.production}</p>
                    {data.total_production_value > 0 && (
                      <p className="text-muted-foreground text-xs">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(data.total_production_value)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-3">
              <p className="text-muted-foreground text-xs tracking-widest uppercase">
                Pemasangan Pal Batas
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ScaleIcon className="size-6 text-indigo-500" />
                  <p className="text-xl font-bold">
                    {data.limit_pal}{" "}
                    <span className="text-sm font-medium">Titik</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </MetrictsSnapshot>

        <div className="border border-zinc-100 bg-white p-4">
          <div className="mb-2 flex items-center gap-2">
            <MapPinIcon className="size-4 text-rose-500" />
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Pengukuran Titik Batas
            </p>
          </div>
          <p className="text-sm leading-relaxed">
            {data.limit_point_measurement}
          </p>
        </div>

        <div className="border border-zinc-100 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileImageIcon className="size-4 text-blue-500" />
              <p className="text-muted-foreground text-xs tracking-widest uppercase">
                File Desain
              </p>
            </div>
            {data.design_path ? (
              <Button variant="link" size="sm" className="h-auto p-0" asChild>
                <a
                  href={toPreviewUrl(data.design_path)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DownloadIcon className="mr-1 size-3.5" /> Unduh Dokumen
                </a>
              </Button>
            ) : (
              <p className="text-muted-foreground text-xs italic">
                Belum diunggah
              </p>
            )}
          </div>
        </div>

        {/* Documentation Gallery */}
        <DocumentationCarouselGallery type="revitalization" id={data.id} />
      </div>
      <SheetFooter>
        <Button size="lg" asChild>
          <Link href={`/revitalisasi/${areaSlug}`}>
            Lihat lebih lanjut
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </SheetFooter>
    </div>
  );
}

function LastUpdateStatus({
  progressDate,
  areaId,
  onReportSelect,
}: {
  progressDate?: string | null;
  areaId: number;
  onReportSelect: (id: string) => void;
}) {
  const parsedDate = progressDate ? new Date(progressDate) : undefined;

  return (
    <div className="flex flex-col items-start gap-4 border-y border-dashed py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col items-start gap-3 text-base">
        <div className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
        </div>
        <p>Data Terakhir Diperbarui</p>
      </div>
      <RevitalizationReportDatePicker
        areaId={areaId}
        initialDate={parsedDate}
        onReportSelect={onReportSelect}
      />
    </div>
  );
}
