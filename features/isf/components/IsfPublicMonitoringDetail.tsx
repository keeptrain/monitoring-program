"use client";

import DocumentationCarouselGallery from "@/components/shared/DocumentationCarouselGallery";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, TractorIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Label } from "recharts";

export default function IsfPublicMonitoringDetail({
  data,
}: {
  data: {
    name: string;
    documentation_before_path?: string | null;
    documentation_after_paths?: string[];
  };
}) {
  const beforeImage = data.documentation_before_path
    ? { src: data.documentation_before_path, alt: `${data.name} sebelum` }
    : {
        src: "/images/revitalisasi-tambak-pantura.jpg",
        alt: "Revitalisasi Tambak",
      };

  const afterImages =
    data.documentation_after_paths && data.documentation_after_paths.length > 0
      ? data.documentation_after_paths.map((src, index) => ({
          src,
          alt: `${data.name} sesudah ${index + 1}`,
        }))
      : [
          { src: "/images/tambak-udang.jpg", alt: "Tambak Udang" },
          { src: "/images/bioflok.jpeg", alt: "Sistem Bioflok" },
        ];

  return (
    <div className="relative flex h-[calc(100vh-100px)] flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 space-y-8 overflow-y-auto px-4 pb-14">
        {/* Last Updated Status */}
        <LastUpdateStatus />

        <div className="flex w-full items-center gap-12">
          <div className="size-[140px] shrink-0">
            <ZoneProgressChart progress={85} />
          </div>

          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                Tenaga Kerja
              </p>
              <div className="flex items-center gap-3">
                <UsersIcon className="size-6" />
                <p className="text-xl font-bold">
                  45 <span className="text-sm">Orang</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                Alat Berat
              </p>
              <div className="flex items-center gap-3">
                <TractorIcon className="size-6" />
                <p className="text-xl font-bold">
                  12 <span className="text-sm">Unit</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <DocumentationCarouselGallery
          beforeImage={beforeImage}
          afterImages={afterImages}
        />

        {/* Description */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            Ringkasan Aktivitas
          </p>
          <p className="text-foreground/80 text-sm leading-relaxed">
            Tahapan ini mencakup implementasi {data.name} pada kawasan
            Integrated Shrimp Farming. Seluruh infrastruktur telah terpasang dan
            beroperasi sesuai standar operasional yang ditetapkan.
          </p>
        </div>
      </div>

      {/* Fixed Bottom Button - Locked to Bottom of Sheet */}
      <div className="absolute right-0 bottom-0 left-0 px-4">
        <Button asChild className="w-full">
          <Link href="/monitoring/isf">
            Lihat lebih lanjut untuk {data.name}{" "}
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function LastUpdateStatus() {
  return (
    <div className="flex flex-col items-start gap-4 border-y border-dashed py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col items-start gap-3 text-base">
        <div className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
        </div>
        <p>Data Terakhir Diperbarui</p>
      </div>
      <div className="flex flex-col items-end text-lg">
        <p className="text-foreground uppercase">17 April 2024</p>
        <p className="text-muted-foreground uppercase">15:45 WIB</p>
      </div>
    </div>
  );
}
function ZoneProgressChart({ progress }: { progress: number }) {
  const data = [
    { name: "Progress", value: progress, fill: "#3b82f6" },
    { name: "Sisa", value: 100 - progress, fill: "#f1f5f9" },
  ];

  return (
    <PieChart width={140} height={140}>
      <Pie
        data={data}
        innerRadius={55}
        outerRadius={70}
        startAngle={90}
        endAngle={450}
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
                  className="fill-primary text-2xl font-bold"
                >
                  {progress}%
                </tspan>
              </text>
            );
          }}
        />
      </Pie>
    </PieChart>
  );
}
