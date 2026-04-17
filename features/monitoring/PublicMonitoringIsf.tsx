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
  ShrimpIcon,
  TrendingUpIcon,
  UsersIcon,
  HardHat,
  LucideIcon,
  ArrowRight,
  TractorIcon,
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

const PIN_LOCATIONS: Record<number, { x: string; y: string }> = {
  1: { x: "15%", y: "45%" },
  2: { x: "28%", y: "52%" },
  3: { x: "42%", y: "40%" },
  4: { x: "55%", y: "62%" },
  5: { x: "70%", y: "48%" },
  6: { x: "82%", y: "35%" },
  7: { x: "90%", y: "65%" },
};

const ISF_PROGRESS_DUMMY_DATA = [
  {
    name: "Minggu 1",
    z1: 4.5,
    z2: 2.5,
    z3: 3.2,
    z4: 3.8,
    z5: 4.1,
    z6: 2.8,
    z7: 3.5,
  },
  {
    name: "Minggu 2",
    z1: 3.2,
    z2: 4.8,
    z3: 2.8,
    z4: 4.2,
    z5: 3.9,
    z6: 4.5,
    z7: 2.2,
  },
  {
    name: "Minggu 3",
    z1: 3.8,
    z2: 2.1,
    z3: 4.5,
    z4: 4.5,
    z5: 2.4,
    z6: 3.1,
    z7: 4.8,
  },
  {
    name: "Minggu 4",
    z1: 4.5,
    z2: 3.2,
    z3: 5.2,
    z4: 4.8,
    z5: 4.9,
    z6: 5.5,
    z7: 3.1,
  },
];

export default function PublicMonitoringIsf() {
  const [selectedStep, setSelectedStep] = useState<(typeof STEPS)[0] | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);

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

          <Separator className="opacity-50" />

          <IsfOverallSummary />

          <Separator className="opacity-50" />

          <IsfProgressChart />
        </div>

        {/* Bottom Row: Specialized Reports Cards */}
        <div className="py-24">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-10">
            {/* Ketenagakerjaan Card */}
            <ResourceStatItem
              icon={UsersIcon}
              title="Ketenagakerjaan"
              subTitle="Terverifikasi Lapangan"
              statusLabel="Live Status"
              statusBg="bg-primary"
              value="45 ORANG"
              valueDesc="Total pekerja aktif hari ini"
              trend={
                <div className="flex items-center gap-1.5">
                  <TrendingUpIcon className="size-4 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-500 uppercase">
                    +12% Kenaikan
                  </span>
                </div>
              }
              updateText="Update: 17 April 2024"
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
              valueDesc="Aktif di 7 zona pengerjaan"
              trend={
                <div className="flex items-center gap-1.5">
                  <HardHat className="text-primary size-4" />
                  <span className="text-primary text-xs font-bold uppercase">
                    8 Exc, 4 Bulldozer
                  </span>
                </div>
              }
              updateText="Status: Standby & Run"
              href="/monitoring/equipment"
            />
          </div>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-white",
                  selectedStep && STEP_COLORS[selectedStep.id],
                )}
              >
                <ShrimpIcon className="h-5 w-5" />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold uppercase italic">
                  Zona {selectedStep?.id}
                </SheetTitle>
                <SheetDescription className="text-xs font-medium tracking-widest uppercase">
                  {selectedStep?.name}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <IsfPublicMonitoringDetail
            data={{ name: selectedStep?.name || "" }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ResourceStatItem({
  icon: Icon,
  title,
  subTitle,
  value,
  valueDesc,
  trend,
  updateText,
  subTitleColor = "text-emerald-600",
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
    <Card className="bg-muted/40 hover:bg-muted/60 overflow-hidden border-none shadow-sm transition-all">
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Icon className="text-primary size-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="block text-sm font-semibold uppercase">
                {title}
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium uppercase",
                  subTitleColor,
                )}
              >
                {subTitle}
              </span>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={href}>
              Lihat Detail
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-1">
            <p className="text-xl font-semibold">{value}</p>
            <p className="text-muted-foreground text-xs font-medium">
              {valueDesc}
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 sm:items-end sm:gap-2">
            <div className="flex flex-col items-start gap-1 sm:items-end">
              {trend}
              <p className="text-muted-foreground text-[10px] font-medium uppercase">
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
    <div className="flex w-full flex-col items-center justify-center space-y-5">
      <p className="text-primary text-xs font-black tracking-[0.2em] uppercase">
        Legenda Zona
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4">
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

function IsfOverallSummary() {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-8">
      <p className="text-primary text-xs font-black tracking-[0.3em] uppercase">
        Overall Summary
      </p>

      <div className="flex w-full flex-col items-center justify-center gap-12 sm:flex-row lg:gap-20">
        {/* Left: Pie Chart */}
        <div className="flex size-64 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={STEPS.map((s) => ({
                  ...s,
                  fill:
                    s.id === 1
                      ? "#3b82f6"
                      : s.id === 2
                        ? "#10b981"
                        : s.id === 3
                          ? "#f59e0b"
                          : s.id === 4
                            ? "#f43f5e"
                            : s.id === 5
                              ? "#8b5cf6"
                              : s.id === 6
                                ? "#06b6d4"
                                : "#14b8a6",
                }))}
                dataKey="id"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={75}
                stroke="none"
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
                          82%
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
          {STEPS.map((s) => {
            const mockProgress = [20, 14, 36, 12, 8, 4, 0][s.id - 1] || 0;
            return (
              <div key={s.id} className="space-y-1.5">
                <div className="flex justify-between gap-3 text-[11px] font-bold tracking-tight uppercase">
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
                    {mockProgress}%
                  </span>
                </div>
                <Progress value={mockProgress} className="h-2" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function IsfProgressChart() {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-8">
      <p className="text-primary text-xs font-black tracking-[0.3em] uppercase">
        Grafik Progress
      </p>

      <div className="h-[300px] w-full max-w-4xl">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={ISF_PROGRESS_DUMMY_DATA}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
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
              domain={[0, 10]}
              ticks={[0, 5, 10]}
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
            <Line
              type="monotone"
              dataKey="z1"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="z2"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="z3"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="z4"
              stroke="#f43f5e"
              strokeWidth={3}
              dot={{ r: 4, fill: "#f43f5e", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="z5"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="z6"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ r: 4, fill: "#06b6d4", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="z7"
              stroke="#14b8a6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#14b8a6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
