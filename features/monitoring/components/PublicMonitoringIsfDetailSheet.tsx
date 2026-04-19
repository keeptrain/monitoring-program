"use client";

import DocumentationCarouselGallery from "@/components/shared/DocumentationCarouselGallery";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, TractorIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Label } from "recharts";
import { IsfDetailSheet } from "../types/monitoring-types";

export default function PublicMonitoringIsfDetailSheet({
  data,
}: {
  data: IsfDetailSheet;
}) {
  const { id, step_id, progress_percent, total_worker, updated_at } = data;

  return (
    <div className="relative flex h-[calc(100vh-100px)]">
      {/* Scrollable Content */}
      <div className="space-y-10 overflow-y-auto px-4 pb-14">
        {/* Last Updated Status */}
        <LastUpdateStatus updatedAt={updated_at} />

        <div className="flex w-full items-center gap-12">
          <div className="size-[140px] shrink-0">
            <ZoneProgressChart progress={progress_percent} />
          </div>

          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                Tenaga Kerja
              </p>
              <div className="flex items-center gap-3">
                <UsersIcon className="size-6" />
                <p className="text-xl font-bold">
                  {total_worker} <span className="text-sm">Orang</span>
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

        <DocumentationCarouselGallery type="isf" id={id} />

        {/* Description */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            Ringkasan Aktivitas
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quod. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Quisquam, quod.
          </p>
        </div>
      </div>

      {/* Fixed Bottom Button - Locked to Bottom of Sheet */}
      <div className="absolute right-0 bottom-0 left-0 px-4">
        <Button className="w-full" size="lg" asChild>
          <Link href={`/monitoring/isf/zona${step_id}`}>
            Lihat lebih lanjut
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function LastUpdateStatus({ updatedAt }: { updatedAt?: string | null }) {
  const parsedDate = updatedAt ? new Date(updatedAt) : null;
  const hasValidDate =
    parsedDate !== null && !Number.isNaN(parsedDate.getTime());

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
        <p className="text-foreground uppercase">
          {hasValidDate
            ? parsedDate.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "-"}
        </p>
        <p className="text-muted-foreground uppercase">
          {hasValidDate
            ? `${parsedDate.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })} WIB`
            : "-"}
        </p>
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
