"use client";

import { UsersIcon, TractorIcon, InfoIcon, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MonitoringDocumentationCarousel from "./MonitoringDocumentationCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface MonitoringRightSideStatsProps {
  totalWorkers: number;
  documentationUrls: string[];
  isPending: boolean;
  rekrutmenLink?: string;
  heavyEquipmentPopoverContent?: React.ReactNode;
}

export default function MonitoringRightSideStats({
  totalWorkers,
  documentationUrls,
  isPending,
  rekrutmenLink,
  heavyEquipmentPopoverContent,
}: MonitoringRightSideStatsProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 text-center md:w-fit">
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
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums">
                  {isPending ? <Skeleton className="h-6 w-12" /> : totalWorkers}
                  <span className="text-muted-foreground text-xs font-medium uppercase">
                    Orang
                  </span>
                </div>
              </div>
              {rekrutmenLink && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  asChild
                >
                  <Link href={rekrutmenLink}>
                    Rekrutmen
                    <ArrowUpRight className="ml-1 size-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground/80 text-xs font-bold tracking-widest uppercase">
              Alat Berat
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <TractorIcon className="text-primary size-5" />
                <p className="flex items-baseline gap-1 text-xl font-bold tabular-nums">
                  103
                  <span className="text-muted-foreground text-xs font-medium uppercase">
                    Unit
                  </span>
                </p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    Rincian Alat Berat <InfoIcon className="ml-1 size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-4">
                  {heavyEquipmentPopoverContent || (
                    <div className="text-muted-foreground text-center text-sm">
                      Data rincian belum tersedia
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      <MonitoringDocumentationCarousel
        images={documentationUrls}
        isPending={isPending}
      />
    </div>
  );
}
