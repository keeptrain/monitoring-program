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

const PIN_LOCATIONS: Record<number, { x: string; y: string }> = {
  1: { x: "15%", y: "45%" },
  2: { x: "28%", y: "52%" },
  3: { x: "42%", y: "40%" },
  4: { x: "55%", y: "62%" },
  5: { x: "70%", y: "48%" },
  6: { x: "82%", y: "35%" },
  7: { x: "90%", y: "65%" },
};

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

      <Separator />

      {/* Bottom Stats Section */}
      <div className="mx-auto flex w-full max-w-2xl flex-col sm:max-w-6xl">
        {/* Top Row: Symmetrical Legend, Pie, and Summary */}
        <div className="flex flex-col items-start justify-between gap-10 py-6 sm:flex-row lg:gap-16 lg:py-8">
          {/* 1. Legenda Zona */}
          <div className="shrink-0 space-y-4">
            <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
              Legenda Zona
            </p>
            <div className="grid min-w-[280px] grid-flow-col grid-rows-4 gap-x-8 gap-y-2">
              {STEPS.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <div
                    className={cn("size-2 rounded-full", STEP_COLORS[s.id])}
                  />
                  <span className="text-foreground/80 text-[11px] font-medium tracking-tight uppercase">
                    {s.id}. {s.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Pie Chart Simulation (Center-aligned visually in row) */}
          <div className="flex items-center gap-6">
            <div className="border-primary border-t-muted relative flex size-32 shrink-0 items-center justify-center rounded-full border-8">
              <span className="text-3xl font-bold">15%</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold tracking-tight uppercase">
                Total Progress
              </h3>
              <p className="text-muted-foreground text-[11px] leading-tight font-medium">
                Akumulasi seluruh <br /> tahapan zona
              </p>
            </div>
          </div>

          {/* 3. Overall Summary */}
          <div className="flex min-w-[320px] flex-col space-y-4">
            <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
              Overall Summary
            </p>
            <div className="grid grid-flow-col grid-rows-4 gap-x-10 gap-y-3">
              {STEPS.map((s) => {
                const mockProgress = [20, 14, 36, 12, 8, 4, 0][s.id - 1] || 0;
                return (
                  <div key={s.id} className="space-y-1.5">
                    <div className="flex justify-between gap-3 text-[11px] font-medium tracking-tight uppercase">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={cn(
                            "size-1.5 rounded-full",
                            STEP_COLORS[s.id],
                          )}
                        />
                        <span className="text-foreground/80">Zona {s.id}</span>
                      </div>
                      <span className="text-primary font-semibold">
                        {mockProgress}%
                      </span>
                    </div>
                    <Progress value={mockProgress} className="h-1" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Row: Specialized Reports Cards */}
        <div className="px-6 pb-12 sm:px-0 lg:pb-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-10">
            {/* Ketenagakerjaan Card */}
            <Card className="bg-muted/30 hover:bg-muted/50 overflow-hidden border-none shadow-sm transition-all">
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
            </Card>

            {/* Alat Berat Card */}
            <Card className="bg-muted/40 hover:bg-muted/60 overflow-hidden border-none shadow-sm transition-all">
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
            </Card>
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
  statusLabel,
  statusBg = "bg-primary",
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
  href?: string;
}) {
  return (
    <CardContent className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Icon className="text-primary size-5" />
          </div>
          <div>
            <span className="block text-sm font-bold tracking-tight uppercase">
              {title}
            </span>
            <span
              className={cn("text-[10px] font-medium uppercase", subTitleColor)}
            >
              {subTitle}
            </span>
          </div>
        </div>
        <div
          className={cn(
            "px-2 py-0.5 text-[9px] font-bold tracking-widest text-white uppercase",
            statusBg,
          )}
        >
          {statusLabel}
        </div>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-4xl leading-none font-bold tracking-tighter">
            {value}
          </p>
          <p className="text-muted-foreground mt-2 text-xs font-medium">
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

          {href && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="group/btn -ml-3 h-8 gap-1.5 text-xs font-bold tracking-tight uppercase hover:bg-transparent sm:ml-0 sm:pr-0"
            >
              <Link href={href}>
                Lihat Detail
                <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </CardContent>
  );
}
