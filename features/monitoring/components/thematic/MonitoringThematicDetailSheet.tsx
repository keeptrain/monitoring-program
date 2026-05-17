import DocumentationCarouselGallery from "@/components/shared/DocumentationCarouselGallery";
import { DetailItem } from "@/components/shared/DetailItem";
import type { ThematicProgram } from "../../types/monitoring-types";
import { ProgressPieChart } from "../shared/ProgressPieChart";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function MonitoringThematicDetailSheet({
  isAuthenticated,
  type,
  data,
}: {
  isAuthenticated: boolean;
  type: "biofloc_thematic" | "minapadi_thematic";
  data: ThematicProgram;
}) {
  return (
    <div className="no-scrollbar space-y-6 overflow-y-auto px-4">
      <LastUpdatedInfo updatedAt={data.updated_at} />
      {/* Details Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Progress
          </p>
          <ProgressPieChart progress={data.progress_percent} size={100} />
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <DetailItem label="Komoditas Bantuan" value={data.commodity_aid} />
          <DetailItem
            label="Komoditas Potensi"
            value={data.commodity_potential || "-"}
          />
        </div>
        {isAuthenticated && (
          <>
            <Separator className="col-span-2" />
            <DetailItem
              label="Nomor KUSUKA"
              value={data.kdmp_entities?.kusuka_number || "-"}
            />
            <DetailItem label="NIB" value={data.kdmp_entities?.nib || "-"} />
            <DetailItem
              label="Nama Badan Hukum"
              value={data.kdmp_entities?.name || "-"}
            />
            <Separator className="col-span-2" />
          </>
        )}
      </div>

      {/* Documentation Section - source from `documentations` table */}
      <DocumentationCarouselGallery type={type} id={data.id} />
    </div>
  );
}

function LastUpdatedInfo({ updatedAt }: { updatedAt: string }) {
  return (
    <div className="flex flex-col items-start gap-4 border-y border-dashed py-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm">
        <div className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
        </div>
        <p>Data Terakhir Diperbarui</p>
      </div>
      <div className="flex flex-col items-end text-base">
        {formatDate(updatedAt)}
      </div>
    </div>
  );
}
