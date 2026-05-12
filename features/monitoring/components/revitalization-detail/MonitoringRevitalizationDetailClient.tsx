"use client";

import { useState } from "react";
import { WeekDetailInfo } from "../isf-detail/WeekDetailInfo";
import { LazyDocumentationSection } from "../isf-detail/LazyDocumentationSection";
import { ProgressPieChartZoneIsf } from "../isf-detail/ProgressPieChartZoneIsf";
import { RevitalizationReportDatePicker } from "./RevitalizationReportDatePicker";
import { getRevitalizationProgramLogById } from "@/features/revitalisasi/actions/revitalization-program-logs";
import { Button } from "@/components/ui/button";
import {
  ScaleIcon,
  MapPinIcon,
  FileTextIcon,
  DownloadIcon,
} from "lucide-react";
import { toPreviewUrl } from "@/lib/utils";

export default function MonitoringRevitalizationDetailClient({
  data,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  data: any;
}) {
  const latestReport = data?.data?.[0];
  const [currentReport, setCurrentReport] = useState<any>(latestReport);

  const handleReportSelect = async (reportId: string) => {
    try {
      const res = await getRevitalizationProgramLogById(reportId);
      setCurrentReport(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const activeReportData = currentReport
    ? {
        dbId: currentReport.id,
        hasReport: true,
        progress: currentReport.progress_percent || 0,
        progressDate: currentReport.progress_date || null,
        provider_name: currentReport.provider_name || "-",
        production: currentReport.production || "-",
        total_production_value: currentReport.total_production_value || 0,
        limit_pal: currentReport.limit_pal || 0,
        limit_point_measurement: currentReport.limit_point_measurement || "-",
        design_path: currentReport.design_path || null,
        intervention: currentReport.intervention || "-",
        total_worker: currentReport.total_worker || 0,
        outcome: currentReport.outcome || "-",
        constraints: currentReport.constraints || "-",
        follow_up: currentReport.follow_up || "-",
      }
    : null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-end">
        {latestReport?.area_id && (
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm">
              Pilih Periode Laporan:{" "}
            </p>
            <RevitalizationReportDatePicker
              areaId={latestReport.area_id}
              initialDate={
                latestReport?.progress_date
                  ? new Date(latestReport.progress_date)
                  : undefined
              }
              onReportSelect={handleReportSelect}
            />
          </div>
        )}
      </div>

      {/* Konten Detail & Chart */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col items-center gap-4">
          <ProgressPieChartZoneIsf
            progress={activeReportData?.progress || 0}
            size={176}
          />
          {activeReportData?.hasReport && (
            <div className="mt-4 w-full text-center">
              <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                Tenaga Kerja
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">
                {activeReportData.total_worker}{" "}
                <span className="text-xs font-medium text-zinc-500">Orang</span>
              </p>
            </div>
          )}
        </div>

        {/* Detail Info */}
        <div className="md:col-span-2">
          {activeReportData?.hasReport && (
            <WeekDetailInfo data={activeReportData} />
          )}
        </div>
      </div>

      {/* Tambahan Info Produksi & Batas di Bawah Grid Utama */}
      {activeReportData?.hasReport && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border border-zinc-100 bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <ScaleIcon className="size-4 text-indigo-500" />
                <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                  Pemasangan Pal Batas
                </p>
              </div>
              <p className="leading-tight font-semibold text-zinc-900">
                {activeReportData.limit_pal} Titik
              </p>
            </div>

            <div className="border border-zinc-100 bg-white p-4">
              <div className="flex flex-col items-start">
                <div className="mb-2 flex items-center gap-2">
                  <FileTextIcon className="size-4 text-blue-500" />
                  <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                    File Desain
                  </p>
                </div>
                {activeReportData.design_path ? (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto justify-start p-0 font-semibold"
                    asChild
                  >
                    <a
                      href={toPreviewUrl(activeReportData.design_path)}
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
          </div>

          <div className="border border-zinc-100 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <MapPinIcon className="size-4 text-rose-500" />
              <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                Pengukuran Titik Batas
              </p>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600">
              {activeReportData.limit_point_measurement}
            </p>
          </div>
        </div>
      )}

      {/* Lazy Documentation Section */}
      {activeReportData?.hasReport && activeReportData?.dbId && (
        <LazyDocumentationSection
          key={activeReportData.dbId}
          type="revitalization"
          programId={activeReportData.dbId}
        />
      )}
    </div>
  );
}
