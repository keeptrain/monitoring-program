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
import { LucideIcon, ArrowRight, ClipboardXIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetPublicMonitoringIsf } from "./api/getPublicLocationsByType";
import { PIN_LOCATIONS } from "./utils/monitoring-constants";
import OverallSummaryIsf from "./components/OverallSummaryIsf";
import ProgressChartIsf from "./components/ProgressChartIsf";
import PublicMonitoringIsfDetailSheet from "./components/PublicMonitoringIsfDetailSheet";

export default function PublicMonitoringIsf() {
  const [sheetOpen, setSheetOpen] = useState<boolean | null>(null);
  const [selectedStep, setSelectedStep] = useState<(typeof STEPS)[0] | null>(
    null,
  );

  const { data, isLoading } = useGetPublicMonitoringIsf();

  const selectedZone = selectedStep
    ? data?.data.find((zone) => zone?.step_id === selectedStep.id)
    : undefined;

  const handlePinClick = (stepId: number) => {
    const step = STEPS.find((s) => s.id === stepId);
    if (step) {
      setSelectedStep(step);
      setSheetOpen(true);
    }
  };

  return (
    <div className="bg-background flex flex-1 flex-col">
      <div className="flex flex-1 flex-col p-4 md:p-4 lg:flex-row lg:gap-8">
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
            {STEPS.map((step) => (
              <IsfPinPoint
                key={step.id}
                step={step}
                onClick={() => handlePinClick(step.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Stats Section */}
      <div className="mx-auto flex w-full max-w-none flex-col px-6 sm:max-w-6xl sm:px-0">
        {/* Top Row: Symmetrical Legend, Pie, and Summary */}
        <div className="flex flex-col gap-10 py-6 md:py-4">
          {/* 1. Legenda Zona - Sub-component */}
          <LegendaZona />

          <Separator />

          {data && <OverallSummaryIsf data={data} />}

          <Separator />

          <ProgressChartIsf />
        </div>

        {/* Bottom Row: Specialized Reports Cards */}
        <div className="py-24"></div>
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
            {!selectedZone && !isLoading ? (
              <EmptyZoneDetail />
            ) : (
              selectedZone && (
                <PublicMonitoringIsfDetailSheet data={selectedZone} />
              )
            )}
            {isLoading && (
              <p className="text-muted-foreground mt-4 text-xs">
                Memuat data...
              </p>
            )}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

function EmptyZoneDetail() {
  return (
    <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center space-y-4 px-6 text-center">
      <div className="bg-muted flex size-16 items-center justify-center rounded-full">
        <ClipboardXIcon className="text-muted-foreground size-8" />
      </div>
      <div className="space-y-1">
        <p className="text-foreground text-base font-semibold">
          Belum Ada Data Laporan
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Zona ini belum melakukan penginputan laporan <br /> monitoring untuk
          periode ini.
        </p>
      </div>
    </div>
  );
}

function LegendaZona() {
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

function IsfPinPoint({
  step,
  onClick,
}: {
  step: (typeof STEPS)[0];
  onClick: () => void;
}) {
  const pos = PIN_LOCATIONS[step.id];
  if (!pos) return null;

  return (
    <button
      onClick={onClick}
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
}

function SpecializedCard() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-10">
      {/* Ketenagakerjaan Card */}
      {/* <ResourceStatItem
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
            /> */}

      {/* Alat Berat Card */}
      {/* <ResourceStatItem
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
            /> */}
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
