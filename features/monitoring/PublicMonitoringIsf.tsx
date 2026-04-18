"use client";

import Image from "next/image";
import { useState } from "react";
import { STEPS, STEP_COLORS } from "../isf/constants/isf-step";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  TrendingUpIcon,
  HardHat,
  LucideIcon,
  ArrowRight,
  TractorIcon,
  UsersRoundIcon,
} from "lucide-react";
import IsfPublicMonitoringDetail from "../isf/components/IsfPublicMonitoringDetail";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useGetPublicIsfMonitoringDashboard } from "./api/getPublicLocationsByType";
import { LINE_SERIES, PIN_LOCATIONS } from "./utils/monitoring-constants";

export default function PublicMonitoringIsf() {
  const [sheetOpen, setSheetOpen] = useState<boolean | null>(null);
  const [selectedStep, setSelectedStep] = useState<(typeof STEPS)[0] | null>(
    null,
  );

  const { data: dashboard, isLoading } = useGetPublicIsfMonitoringDashboard();

  const handlePinClick = (stepId: number) => {
    const step = STEPS.find((s) => s.id === stepId);
    if (step) {
      setSelectedStep(step);
      setSheetOpen(true);
    }
  };

  return (
    <div className="bg-background no-scrollbar absolute inset-0 flex h-full w-full flex-col overflow-y-auto">
      <div className="flex flex-1 flex-col p-6 lg:flex-row lg:gap-8 lg:p-10">
        {/* Main Map Area */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative aspect-video w-full max-w-6xl">
            <Image
              src="/images/isf_map.webp"
              alt="ISF Map"
              width={1920}
              height={1080}
              className="h-full w-full"
              priority
            />

            {/* Pin Points */}
            {STEPS.map((step) => {
              const pos = PIN_LOCATIONS[step.id];
              if (!pos) return null;

              return (
                <button
                  key={step.id}
                  onClick={() => handlePinClick(step.id)}
                  className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125"
                  style={{ left: pos.x, top: pos.y }}
                >
                  <div className="relative flex items-center justify-center">
                    <div
                      className={cn(
                        "absolute h-10 w-10 animate-ping rounded-full opacity-40",
                        STEP_COLORS[step.id] || "bg-primary",
                      )}
                    />
                    <div
                      className={cn(
                        "relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-white shadow-xl",
                        STEP_COLORS[step.id] || "bg-primary",
                      )}
                    >
                      <span className="text-[10px] font-bold">{step.id}</span>
                    </div>
                    <div className="bg-background/90 border-border text-foreground absolute top-full mt-2 hidden min-w-max border px-2 py-1 text-[10px] font-semibold tracking-wide uppercase shadow-lg backdrop-blur lg:group-hover:block">
                      {step.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Stats Section */}
      <div className="mx-auto flex w-full max-w-none flex-col px-6 sm:max-w-6xl sm:px-0">
        {/* Top Row: Symmetrical Legend, Pie, and Summary */}
        <div className="flex flex-col gap-10 py-6 md:py-4">
          {/* 1. Legenda Zona - Sub-component */}
          <IsfLegendaZona />

          <Separator />

          <IsfOverallSummary
            overallProgress={dashboard?.overall_progress ?? 0}
            pieData={dashboard?.pie_chart ?? []}
            zones={dashboard?.zones ?? []}
          />

          <Separator />

          <IsfProgressChart data={dashboard?.line_chart ?? []} />
        </div>

        {/* Bottom Row: Specialized Reports Cards */}
        <div className="py-24">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-10">
            {/* Ketenagakerjaan Card */}
            <ResourceStatItem
              icon={UsersRoundIcon}
              title="Ketenagakerjaan"
              subTitle="Terverifikasi Lapangan"
              statusLabel="Live Status"
              statusBg="bg-primary"
              value={`${dashboard?.workforce_total ?? 0} ORANG`}
              valueDesc="Total pekerja aktif hari ini"
              trend={
                <div className="flex items-center gap-1.5">
                  <TrendingUpIcon className="size-4 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-500 uppercase">
                    {dashboard?.active_zone_count ?? 0} Zona Aktif
                  </span>
                </div>
              }
              updateText={
                dashboard?.updated_at
                  ? `Update: ${new Date(dashboard.updated_at).toLocaleDateString("id-ID")}`
                  : "Update: -"
              }
              href="/monitoring/labor"
            />

            {/* Alat Berat Card */}
            <ResourceStatItem
              icon={TractorIcon}
              title="Alat Berat"
              subTitle="Unit Terintegrasi"
              statusLabel="Operational"
              statusBg="bg-blue-600"
              subTitleColor="text-blue-600"
              value="12 UNIT"
              valueDesc={`Aktif di ${dashboard?.active_zone_count ?? 0} zona pengerjaan`}
              trend={
                <div className="flex items-center gap-1.5">
                  <HardHat className="text-primary size-4" />
                  <span className="text-primary text-xs font-bold uppercase">
                    {dashboard?.total_logs ?? 0} laporan masuk
                  </span>
                </div>
              }
              updateText="Status: Standby & Run"
              href="/monitoring/equipment"
            />
          </div>
        </div>
      </div>

      {/* Sheet */}
      {sheetOpen !== null && selectedStep && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent
            side="right"
            className="data-[side=right]:sm:max-w-[600px]"
          >
            <SheetHeader>
              <SheetTitle className="text-xl">
                Zona {selectedStep.id}
              </SheetTitle>
              <SheetDescription className="text-xs font-medium tracking-widest uppercase">
                {selectedStep.name}
              </SheetDescription>
            </SheetHeader>

            <IsfPublicMonitoringDetail data={{ name: selectedStep.name }} />
            {isLoading ? (
              <p className="text-muted-foreground mt-4 text-xs">
                Memuat data...
              </p>
            ) : null}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

function ResourceStatItem({
  icon: Icon,
  title,
  value,
  valueDesc,
  trend,
  updateText,
  href,
}: {
  icon: LucideIcon;
  title: string;
  subTitle: string;
  statusLabel: string;
  statusBg?: string;
  value: string;
  valueDesc: string;
  trend?: React.ReactNode;
  updateText: string;
  subTitleColor?: string;
  href: string;
}) {
  return (
    <Card className="bg-muted/40 hover:bg-muted/60 transition-all">
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg">
              <Icon className="text-primary size-6" />
            </div>
            <span className="block text-sm font-semibold uppercase">
              {title}
            </span>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={href}>
              Detail
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-1">
            <p className="text-lg font-semibold">{value}</p>
            <p className="text-muted-foreground text-xs font-medium">
              {valueDesc}
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 sm:items-end sm:gap-2">
            <div className="flex flex-col items-start gap-1 sm:items-end">
              {trend}
              <p className="text-muted-foreground font-medium uppercase">
                {updateText}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function IsfLegendaZona() {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-6">
      <p className="text-primary text-xs font-black tracking-[0.2em] uppercase">
        Legenda Zona
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {STEPS.map((s) => (
          <div key={s.id} className="flex items-center gap-2.5">
            <div
              className={cn(
                "size-2.5 rounded-full shadow-sm",
                STEP_COLORS[s.id] || "bg-primary",
              )}
            />
            <span className="text-foreground/70 text-xs font-bold tracking-tight uppercase">
              {s.id}. {s.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IsfOverallSummary({
  overallProgress,
  pieData,
  zones,
}: {
  overallProgress: number;
  pieData: Array<{
    step_id: number;
    name: string;
    value: number;
    fill: string;
  }>;
  zones: Array<{ step_id: number; progress_percent: number }>;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-8">
      <p className="text-primary text-xs font-black tracking-[0.3em] uppercase">
        Overall Summary
      </p>

      <div className="flex w-full flex-col items-center justify-center gap-12 sm:flex-row lg:gap-20">
        {/* Left: Pie Chart */}
        <div style={{ width: 300, height: 200 }}>
          <ResponsiveContainer>
            <PieChart width={300} height={200}>
              <Pie
                data={[
                  ...pieData,
                  {
                    step_id: 99,
                    name: "Sisa",
                    value: Math.max(
                      0,
                      zones.length * 100 - overallProgress * zones.length,
                    ),
                    fill: "#f1f5f9",
                  },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={80}
                stroke="none"
                startAngle={90}
                endAngle={450}
                cornerRadius={4}
                paddingAngle={2}
              >
                <Label
                  content={({ viewBox }) => {
                    const { cx, cy } = viewBox as {
                      cx: number;
                      cy: number;
                    };
                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        <tspan
                          x={cx}
                          y={cy - 2}
                          className="fill-primary text-2xl font-black italic"
                        >
                          {overallProgress}%
                        </tspan>
                        <tspan
                          x={cx}
                          y={cy + 18}
                          className="fill-muted-foreground text-[10px] font-bold tracking-widest uppercase"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Progress Grid */}
        <div className="grid flex-1 grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
          {/* Kolom Kiri: Zona 1-4 */}
          <div className="space-y-4">
            {STEPS.filter((s) => s.id <= 4).map((s) => {
              const progress =
                zones.find((zone) => zone.step_id === s.id)?.progress_percent ??
                0;
              return (
                <div key={s.id} className="space-y-2">
                  <div className="flex justify-between gap-3 text-sm font-bold tracking-tight uppercase">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "size-1.5 rounded-full shadow-sm",
                          STEP_COLORS[s.id] || "bg-primary",
                        )}
                      />
                      <span className="text-foreground/70">Zona {s.id}</span>
                    </div>
                    <span className="text-primary font-semibold tabular-nums">
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2 w-full" />
                </div>
              );
            })}
          </div>

          {/* Kolom Kanan: Zona 5-7 */}
          <div className="space-y-4">
            {STEPS.filter((s) => s.id >= 5).map((s) => {
              const progress =
                zones.find((zone) => zone.step_id === s.id)?.progress_percent ??
                0;
              return (
                <div key={s.id} className="space-y-2">
                  <div className="flex justify-between gap-3 text-sm font-bold tracking-tight uppercase">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "size-1.5 rounded-full shadow-sm",
                          STEP_COLORS[s.id] || "bg-primary",
                        )}
                      />
                      <span className="text-foreground/70">Zona {s.id}</span>
                    </div>
                    <span className="text-primary font-semibold tabular-nums">
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2 w-full" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function IsfProgressChart({
  data,
}: {
  data: Array<{
    name: string;
    z1?: number;
    z2?: number;
    z3?: number;
    z4?: number;
    z5?: number;
    z6?: number;
    z7?: number;
  }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <p className="text-primary text-xs font-black tracking-[0.3em] uppercase">
        Grafik Progress
      </p>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eee"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#999", fontSize: 11, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#999", fontSize: 11, fontWeight: 600 }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={48}
              iconType="plainline"
              formatter={(value) => (
                <span className="text-foreground/70 text-[11px] font-bold tracking-tight uppercase">
                  Zona {value.replace("z", "")}
                </span>
              )}
            />
            {LINE_SERIES.map((series) => (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                stroke={series.color}
                strokeDasharray={series.dash}
                strokeWidth={3}
                dot={{
                  r: series.dotRadius,
                  fill: "#ffffff",
                  strokeWidth: 2,
                  stroke: series.color,
                }}
                activeDot={{ r: series.dotRadius + 2 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
