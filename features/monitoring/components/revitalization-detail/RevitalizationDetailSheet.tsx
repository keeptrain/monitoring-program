import DocumentationCarouselGallery from "@/components/shared/DocumentationCarouselGallery";
import { RevitalizationReportDatePicker } from "./RevitalizationReportDatePicker";
import { RevitalizationDetailSheet as RevitalizationAreaType } from "../../types/monitoring-types";
import MetrictsSnapshot from "../shared/MetrictsSnapshot";

export default function RevitalizationDetailSheet({
  data,
}: {
  data: RevitalizationAreaType;
}) {
  return (
    <div className="mx-4 space-y-6">
      {/* Last Update & Date Picker */}
      <LastUpdateStatus
        areaId={data.area_id}
        progressDate={data.progress_date}
        onReportSelect={(id) => console.log("Selected report:", id)}
      />

      <MetrictsSnapshot progressPercent={data.progress_percent} />

      {/* Documentation Gallery */}
      <DocumentationCarouselGallery type="revitalisasi" id={data.id} />
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
      <RevitalizationReportDatePicker
        areaId={areaId}
        initialDate={parsedDate}
        onReportSelect={onReportSelect}
      />
    </div>
  );
}
