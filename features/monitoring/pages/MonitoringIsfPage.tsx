"use client";

import Image from "next/image";
import { useState } from "react";
import { STEPS, STEP_COLORS } from "../../isf/constants/isf-step";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ClipboardXIcon } from "lucide-react";
import { useGetMonitoringIsf } from "../api/getMonitoringLocationsByType";
import { PIN_LOCATIONS } from "../utils/monitoring-constants";
import IsfStatsSection from "../components/isf/IsfStatsSection";
import IsfDetailSheet from "../components/isf-detail/IsfDetailSheet";
import MonitoringRightSideStats from "../components/shared/MonitoringRightSideStats";
import { IsfHeavyEquipmentPopover } from "../components/isf/IsfHeavyEquipmentPopover";

export default function MonitoringIsfPage() {
  const [sheetOpen, setSheetOpen] = useState<boolean | null>(null);
  const [selectedStep, setSelectedStep] = useState<(typeof STEPS)[0] | null>(
    null,
  );

  const { data, isLoading } = useGetMonitoringIsf();

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
      <div className="flex flex-1 flex-col p-4 md:p-0 lg:flex-row lg:gap-8">
        <div className="flex flex-1 flex-col items-center justify-center gap-8 md:flex-row">
          {/* Main Map Area */}
          <div className="relative aspect-video w-full max-w-4xl">
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

          <MonitoringRightSideStats
            totalWorkers={data?.total_workers || 0}
            documentationUrls={data?.latest_documentation_urls || []}
            isPending={isLoading}
            rekrutmenLink="/isf/rekrutmen"
            heavyEquipmentPopoverContent={<IsfHeavyEquipmentPopover />}
          />
        </div>
      </div>

      <IsfStatsSection />

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
              <SheetDescription className="text-sm font-medium tracking-widest uppercase">
                {selectedStep.name}
              </SheetDescription>
            </SheetHeader>
            {!selectedZone && !isLoading ? (
              <EmptyZoneDetail />
            ) : (
              selectedZone && <IsfDetailSheet data={selectedZone} />
            )}
            {isLoading && (
              <p className="text-muted-foreground animate-pulse px-4 text-xs">
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
