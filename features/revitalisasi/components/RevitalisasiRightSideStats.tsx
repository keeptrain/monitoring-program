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
import Link from "next/link";

const images = [
  "/images/bioflok.jpeg",
  "/images/revitalisasi-tambak-pantura.jpg",
  "/images/tambak-udang.jpg",
];

export default function RevitalisasiRightSideStats() {
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
                <p className="text-xl font-bold tabular-nums">
                  0
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
                  0
                  <span className="text-muted-foreground ml-1 text-xs font-medium uppercase">
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
