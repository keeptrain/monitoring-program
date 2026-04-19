"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { WeekDetailInfo } from "./isf-detail/WeekDetailInfo";
import { LazyDocumentationSection } from "./isf-detail/LazyDocumentationSection";
import { ProgressPieChartZoneIsf } from "./isf-detail/ProgressPieChartZoneIsf";

type MonitoringDetailClientProps = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  data: any;
};

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function MonitoringDetailClient({
  data,
}: MonitoringDetailClientProps) {
  const latestReport = data?.data?.[0];

  const [selectedWeek, setSelectedWeek] = useState<string>(
    latestReport?.reporting_week || "",
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    latestReport?.month || data?.available_months?.[0]?.month || 0,
  );

  // Ambil daftar Senin untuk bulan yang dipilih dari info server
  const currentMonthInfo = data?.available_months?.find(
    (m: any) => m.month === selectedMonth,
  );
  const mondays = currentMonthInfo?.mondays || [];

  const weeks = mondays.map((mondayDate: string, index: number) => {
    const report = data?.data?.find(
      (item: any) => item.reporting_week === mondayDate,
    );
    return {
      id: mondayDate,
      dbId: report?.id,
      weekNumber: index + 1,
      name: `Minggu ${index + 1}`,
      hasReport: !!report,
      progress: report?.progress_percent || 0,
      progressDate: report?.progress_date || null,
      provider_name: report?.provider_name || "-",
      production: report?.production || "-",
      intervention: report?.intervention || "-",
      total_worker: report?.total_worker || 0,
      outcome: report?.outcome || "-",
      constraints: report?.constraints || "-",
      follow_up: report?.follow_up || "-",
    };
  });

  // Ambil data progres untuk minggu yang dipilih
  const activeWeekData = weeks.find((w: any) => w.id === selectedWeek);

  return (
    <div className="space-y-8">
      {/* Weekly Selection Grid */}
      <div className="grid grid-cols-3 gap-4 md:grid-cols-5">
        {weeks.map((week: any) => (
          <WeeklySelectionCard
            key={week.id}
            week={week}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
          />
        ))}
      </div>

      {/* Selector Bulan */}
      <div className="flex justify-end">
        <NativeSelect
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          <NativeSelectOption value="" disabled>
            Pilih Bulan
          </NativeSelectOption>
          {data?.available_months?.map((m: any) => (
            <NativeSelectOption key={m.month} value={m.month}>
              {MONTH_NAMES[m.month - 1]}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      {/* Konten Detail & Chart */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col items-center gap-4">
          <div className="size-44">
            <ProgressPieChartZoneIsf progress={activeWeekData?.progress || 0} />
          </div>
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

function WeeklySelectionCard({
  week,
  selectedWeek,
  setSelectedWeek,
}: {
  week: {
    id: string;
    weekNumber: number;
    name: string;
    hasReport: boolean;
    progress: number;
    progressDate: string | null;
  };
  selectedWeek: string;
  setSelectedWeek: (week: string) => void;
}) {
  const isDisabled = !week.hasReport;

  return (
    <Card
      key={week.id}
      className={cn(
        "relative overflow-hidden transition-all",
        isDisabled
          ? "cursor-not-allowed border-dashed opacity-40 grayscale"
          : "cursor-pointer hover:bg-zinc-50/70",
        selectedWeek === week.id ? "border-primary/50 bg-zinc-100" : "bg-card",
      )}
      onClick={() => !isDisabled && setSelectedWeek(week.id)}
    >
      <CardHeader className="relative">
        <CardTitle className="flex flex-col gap-0.5">
          <p className="text-muted-foreground/60 z-1 -mr-3 flex justify-end text-[10px] font-bold tracking-widest uppercase">
            Minggu
          </p>
          {week.hasReport && week.progressDate && (
            <span className="text-primary/90 pt-4 text-base font-semibold tracking-tighter">
              {formatDate(week.progressDate)}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      {/* Large Background Number (Watermark) */}
      <span className="absolute right-3 -bottom-2 text-7xl font-black tracking-tighter text-zinc-200/50 italic select-none">
        {week.weekNumber}
      </span>
    </Card>
  );
}
