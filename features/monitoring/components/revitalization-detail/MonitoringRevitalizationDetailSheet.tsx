"use client";

import DocumentationCarouselGallery from "@/components/shared/DocumentationCarouselGallery";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Label } from "recharts";
import { RevitalizationDetailSheet } from "../../types/monitoring-types";
import { SheetFooter } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { getRevitalizationProgramLogById } from "@/features/revitalisasi/actions/revitalization-program-logs";
import { RevitalizationReportDatePicker } from "./RevitalizationReportDatePicker";
import { REVITALIZATION_AREAS } from "@/features/revitalisasi/constants/revitalization-area";

export default function MonitoringRevitalizationDetailSheet({
  data: initialData,
}: {
  data: RevitalizationDetailSheet;
}) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const {
    id,
    area_id,
    area_name,
    progress_percent,
    progress_date,
    total_worker,
  } = data;

  const areaSlug =
    REVITALIZATION_AREAS.find((a) => a.id === area_id)?.slug ?? area_id;

  const handleReportSelect = async (reportId: string) => {
    try {
      const res = await getRevitalizationProgramLogById(reportId);
      setData({
        ...res.data,
        area_id,
        area_name,
      } as RevitalizationDetailSheet);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-scroll">
      {/* Scrollable Content */}
      <div className="flex-1 space-y-10 overflow-y-auto px-4 pb-8">
        <LastUpdateStatus
          progressDate={progress_date}
          areaId={area_id}
          onReportSelect={handleReportSelect}
        />

        <div className="flex w-full items-center gap-12">
          <div className="size-[140px] shrink-0">
            <AreaProgressChart progress={progress_percent} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-3">
              <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                Tenaga Kerja
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <UsersIcon className="size-6" />
                  <p className="text-xl font-bold">
                    {total_worker} <span className="text-sm">Orang</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DocumentationCarouselGallery type="revitalization" id={id} />
      </div>

      {/* Fixed Bottom Button - Locked to Bottom of Sheet */}
      <SheetFooter>
        <Button size="lg" asChild>
          <Link href={`/revitalisasi/${areaSlug}`}>
            Lihat lebih lanjut
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </SheetFooter>
    </div>
  );
}

function LastUpdateStatus({
  progressDate,
  areaId,
  onReportSelect,
}: {
  progressDate?: string | null;
  areaId: number;
  onReportSelect: (id: string) => void;
}) {
  const parsedDate = progressDate ? new Date(progressDate) : undefined;

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
        <RevitalizationReportDatePicker
          areaId={areaId}
          initialDate={parsedDate}
          onReportSelect={onReportSelect}
        />
      </div>
    </div>
  );
}

function AreaProgressChart({ progress }: { progress: number }) {
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
