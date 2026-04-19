"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { PieChart, Pie, Label, ResponsiveContainer } from "recharts";

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
      weekNumber: index + 1,
      name: `Minggu ${index + 1}`,
      hasReport: !!report,
      progress: report?.progress_percent || 0,
      progressDate: report?.progress_date || null,
    };
  });

  // Ambil data progres untuk minggu yang dipilih
  const activeWeekData = weeks.find((w: any) => w.id === selectedWeek);

  return (
    <div className="space-y-6">
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="h-[180px] w-[180px]">
          <ZoneProgressChart progress={activeWeekData?.progress || 0} />
        </div>
      </div>
    </div>
  );
}

function ZoneProgressChart({ progress }: { progress: number }) {
  const chartData = [
    { name: "Progress", value: progress, fill: "var(--primary)" },
    { name: "Sisa", value: 100 - progress, fill: "#f1f5f9" },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          innerRadius={65}
          outerRadius={85}
          startAngle={90}
          endAngle={450}
          dataKey="value"
          stroke="none"
          isAnimationActive={true}
          animationDuration={800}
        >
          <Label
            content={({ viewBox }) => {
              const { cx, cy } = viewBox as { cx: number; cy: number };
              return (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  <tspan
                    x={cx}
                    y={cy}
                    className="fill-primary text-3xl font-black tracking-tighter italic"
                  >
                    {progress}%
                  </tspan>
                </text>
              );
            }}
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
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
