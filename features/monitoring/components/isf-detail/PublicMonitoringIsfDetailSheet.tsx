"use client";

import DocumentationCarouselGallery from "@/components/shared/DocumentationCarouselGallery";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { IsfDetailSheet } from "../../types/monitoring-types";
import { SheetFooter } from "@/components/ui/sheet";
import React from "react";

import { getIsfProgramLogById } from "@/features/isf/actions/isf-program-logs";
import { ReportDatePicker } from "@/components/shared/ReportDatePicker";
import MetrictsSnapshot from "../shared/MetrictsSnapshot";

export default function PublicMonitoringIsfDetailSheet({
  data: initialData,
}: {
  data: IsfDetailSheet;
}) {
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const { id, step_id, progress_percent, progress_date } = data;

  const handleReportSelect = async (reportId: string) => {
    try {
      const res = await getIsfProgramLogById(reportId);
      setData(res.data as unknown as IsfDetailSheet);
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
          stepId={step_id}
          onReportSelect={handleReportSelect}
        />

        <MetrictsSnapshot progressPercent={progress_percent} />

        <DocumentationCarouselGallery type="isf" id={id} />

        {/* Description */}
        {/* TODO: Will summary by AI for this section from outcome, constraints, follow up */}
        {/* <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            Aktivitas
          </p>
        </div> */}
      </div>

      {/* Fixed Bottom Button - Locked to Bottom of Sheet */}
      <SheetFooter>
        <Button size="lg" asChild>
          <Link href={`/isf/${step_id}`}>
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
  stepId,
  onReportSelect,
}: {
  progressDate?: string | null;
  stepId: number;
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
        <ReportDatePicker
          zoneId={stepId}
          initialDate={parsedDate}
          onReportSelect={onReportSelect}
        />
      </div>
    </div>
  );
}
