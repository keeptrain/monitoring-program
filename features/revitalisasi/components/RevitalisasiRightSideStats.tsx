"use client";

import Image from "next/image";
import { UsersIcon, TractorIcon, InfoIcon, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useGetMonitoringRevitalization } from "@/features/monitoring/api/getMonitoringRevitalization";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const images = [
  "/images/bioflok.jpeg",
  "/images/revitalisasi-tambak-pantura.jpg",
  "/images/tambak-udang.jpg",
];

export default function RevitalisasiRightSideStats() {
  const { data, isPending } = useGetMonitoringRevitalization();

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
                  {isPending ? (
                    <Skeleton className="h-6 w-12" />
                  ) : (
                    data?.total_workers || 0
                  )}
                  <span className="text-muted-foreground text-xs font-medium uppercase">
                    Orang
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                asChild
              >
                <Link href={`/monitoring/recruitment`}>
                  Rekrutmen
                  <ArrowUpRight className="size-4" />
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
                <p className="flex items-baseline gap-1 text-xl font-bold tabular-nums">
                  0
                  <span className="text-muted-foreground text-xs font-medium uppercase">
                    Unit
                  </span>
                </p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    Rincian Alat Berat <InfoIcon className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-4">
                  <div className="text-muted-foreground text-center text-sm">
                    Data rincian belum tersedia
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      <RevitalisasiDocumentationCarousel />
    </div>
  );
}

function RevitalisasiDocumentationCarousel() {
  return (
    <Carousel
      className="w-84"
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
                  sizes="(max-width: 768px) 100vw, 336px"
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
