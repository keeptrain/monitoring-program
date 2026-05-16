"use client";

import { useState } from "react";
import { WeekDetailInfo } from "./isf-detail/WeekDetailInfo";
import { LazyDocumentationSection } from "./isf-detail/LazyDocumentationSection";
import { ProgressPieChart } from "./shared/ProgressPieChart";
import { ReportDatePicker } from "@/components/shared/ReportDatePicker";
import { getIsfProgramLogById } from "@/features/isf/actions/isf-program-logs";

type MonitoringDetailClientProps = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  data: any;
};

export default function MonitoringDetailClient({
  data,
}: MonitoringDetailClientProps) {
  const latestReport = data?.data?.[0];
  const [currentReport, setCurrentReport] = useState<any>(latestReport);

  const handleReportSelect = async (reportId: string) => {
    try {
      const res = await getIsfProgramLogById(reportId);
      setCurrentReport(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const activeWeekData = currentReport
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
        {latestReport?.step_id && (
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm">
              Pilih Periode Laporan:{" "}
            </p>
            <ReportDatePicker
              zoneId={latestReport.step_id}
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
          <ProgressPieChart
            progress={activeWeekData?.progress || 0}
            size={176}
          />
          {activeWeekData?.hasReport && (
            <div className="mt-4 w-full text-center">
              <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                Tenaga Kerja
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">
                {activeWeekData.total_worker}{" "}
                <span className="text-xs font-medium text-zinc-500">Orang</span>
              </p>
            </div>
          )}
        </div>

        {/* Detail Info */}
        <div className="md:col-span-2">
          {activeWeekData?.hasReport && (
            <WeekDetailInfo data={activeWeekData} />
          )}
        </div>
      </div>

      {/* Lazy Documentation Section */}
      {activeWeekData?.hasReport && activeWeekData?.dbId && (
        <LazyDocumentationSection
          key={activeWeekData.dbId}
          type="isf"
          programId={activeWeekData.dbId}
        />
      )}
    </div>
  );
}
