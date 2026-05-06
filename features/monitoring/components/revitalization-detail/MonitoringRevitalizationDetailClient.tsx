"use client";

import { useState } from "react";
import { WeekDetailInfo } from "../isf-detail/WeekDetailInfo";
import { LazyDocumentationSection } from "../isf-detail/LazyDocumentationSection";
import { ProgressPieChartZoneIsf } from "../isf-detail/ProgressPieChartZoneIsf";
import { RevitalizationReportDatePicker } from "./RevitalizationReportDatePicker";
import { getRevitalizationProgramLogById } from "@/features/revitalisasi/actions/revitalization-program-logs";

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
