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
  ClipboardXIcon,
  TractorIcon,
  UsersIcon,
  ArrowUpRight,
  InfoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetPublicMonitoringIsf } from "./api/getPublicLocationsByType";
import { PIN_LOCATIONS } from "./utils/monitoring-constants";
import OverallSummaryIsf from "./components/OverallSummaryIsf";
import ProgressChartIsf from "./components/ProgressChartIsf";
import PublicMonitoringIsfDetailSheet from "./components/PublicMonitoringIsfDetailSheet";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import Autoplay from "embla-carousel-autoplay";

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
    <div className="bg-background flex flex-1 flex-col py-4">
      <div className="flex flex-1 flex-col p-4 md:p-4 lg:flex-row lg:gap-8">
        <div className="flex flex-1 flex-col items-center justify-center gap-8 md:flex-row">
          {/* Main Map Area */}
          <div className="relative aspect-video w-full max-w-3xl">
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

          <RightSideStats />
        </div>
      </div>

      {/* Bottom Stats Section */}
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-0">
        <div className="grid grid-cols-1 items-start gap-16 py-12 lg:grid-cols-2">
          {data && <OverallSummaryIsf data={data} />}
          <ProgressChartIsf />
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
              <SheetDescription className="text-sm font-medium tracking-widest uppercase">
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

function RightSideStats() {
  const [showRincian, setShowRincian] = useState(false);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 text-center md:w-fit">
      <div className="w-full space-y-6">
        <p className="text-muted-foreground border-b pb-2 text-sm font-bold tracking-[0.2em] uppercase">
          Statistik Jumlah
        </p>

        {/* Summary Metrics Grid */}
        <div className="grid w-full grid-cols-2 items-start gap-8 px-2 sm:px-0">
          <div className="space-y-4">
            <p className="text-muted-foreground/80 text-xs font-bold tracking-widest uppercase">
              Tenaga Kerja
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <UsersIcon className="text-primary size-5" />
                <p className="text-xl font-bold tabular-nums">
                  12
                  <span className="text-muted-foreground ml-1 text-xs font-medium uppercase">
                    Orang
                  </span>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                asChild
              >
                <Link href={`/monitoring/recruitment`}>
                  Rekrutmen
                  <ArrowUpRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground/80 text-xs font-bold tracking-widest uppercase">
              Alat Berat
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <TractorIcon className="text-primary size-5" />
                <p className="text-xl font-bold tabular-nums">
                  103
                  <span className="text-muted-foreground ml-1 text-xs font-medium uppercase">
                    Unit
                  </span>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => setShowRincian(!showRincian)}
              >
                {showRincian ? "Tutup" : "Rincian Alat Berat"}
                <InfoIcon className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* Rincian Section (Conditional) */}
      {showRincian && (
        <div className="animate-in fade-in slide-in-from-top-1 w-full space-y-4 px-2 pb-2 duration-300">
          <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Detail Rincian Alat
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-left text-xs leading-tight font-semibold">
            <div className="space-y-1">
              <p>a) Excavator : 39 Unit</p>
              <p>b) Buldozer : 7 Unit</p>
              <p>c) Grader : 1 Unit</p>
              <p>d) Vibro : 10 Unit</p>
            </div>
            <div className="space-y-1">
              <p>e) Dumptruck : 33 Unit</p>
              <p>f) Fuel Truck : 2 Unit</p>
              <p>g) Dutro Truck : 1 Unit</p>
              <div>
                <p>h) Kendaraan Operasional</p>
                <p className="ml-2">: 10 Unit</p>
              </div>
            </div>
          </div>
          <Separator className="opacity-50" />
        </div>
      )}

      <DocumentationCarousel />
    </div>
  );
}

function DocumentationCarousel() {
  const images = [
    "/images/bioflok.jpeg",
    "/images/revitalisasi-tambak-pantura.jpg",
    "/images/tambak-udang.jpg",
  ];

  return (
    <Carousel
      className="w-80"
      plugins={[Autoplay({ delay: 2000 })]}
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <div className="overflow-hidden border-none">
              <div className="relative aspect-4/3">
                <Image
                  src={src}
                  alt={`Dokumentasi ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
