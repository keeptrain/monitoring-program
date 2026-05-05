import { PublicThematicProgram } from "../../../thematic/actions/public-thematic-programs";
import DocumentationCarouselGallery from "@/components/shared/DocumentationCarouselGallery";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { ProgressPieChartZoneIsf } from "@/features/monitoring/components/isf-detail/ProgressPieChartZoneIsf";

export default function BioflocDetailSheet({
  data,
  isAuthenticated = false,
}: {
  data: PublicThematicProgram | null;
  isAuthenticated?: boolean;
}) {
  if (!data) return null;

  return (
    <div className="no-scrollbar h-full space-y-6 overflow-y-auto px-4 pb-10">
      {/* Details Grid */}
      <div className="bg-muted/20 border-border grid grid-cols-2 gap-px overflow-hidden border">
        <DetailItem label="Komoditas Bantuan" value={data.commodity_aid} />
        <DetailItem
          label="Komoditas Potensi"
          value={data.commodity_potential || "-"}
        />
      </div>

      {isAuthenticated && (
        <div className="bg-muted/20 border-border grid grid-cols-1 gap-px overflow-hidden border">
          <DetailItem label="Nomor KUSUKA" value={data.kusuka_number || "-"} />
          <DetailItem label="NIB" value={data.nib || "-"} />
          <DetailItem
            label="Nomor Badan Hukum"
            value={data.legal_entity_number || "-"}
          />
        </div>
      )}

      {/* Progress Section */}
      <div className="flex items-center justify-center gap-6">
        <p className="text-muted-foreground text-sm font-semibold tracking-[0.2em]">
          Progres
        </p>
        <ProgressPieChartZoneIsf progress={data.progress_percent} size={192} />
      </div>

      <Button className="w-full" asChild>
        <Link href={`/biofloc-thematic/${data.id}`}>
          Data Detail
          <ArrowRightIcon />
        </Link>
      </Button>

      {/* Documentation Section - source from `documentations` table */}
      <DocumentationCarouselGallery type="biofloc_thematic" id={data.id} />
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-background flex flex-col gap-1 p-3">
      <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
        {label}
      </span>
      <span className="text-foreground truncate text-sm leading-tight font-bold uppercase">
        {value ?? "-"}
      </span>
    </div>
  );
}
