"use client";

import { ClipboardXIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { REVITALIZATION_AREAS } from "@/features/revitalisasi/constants/revitalization-area";
import RevitalizationDetailSheet from "../revitalization-detail/RevitalizationDetailSheet";
import { useGetMonitoringRevitalization } from "../../api/getMonitoringRevitalization";
import { RevitalizationDetailSheet as RevitalizationAreaType } from "../../types/monitoring-types";

export default function RevitalizationSheet() {
  const [selectedArea, setSelectedArea] = useQueryState("area");
  const { data } =
    useGetMonitoringRevitalization<RevitalizationAreaType | null>(selectedArea);
  const isEmpty = !data;

  const area = REVITALIZATION_AREAS.find((a) => a.slug === selectedArea);
  const areaName = area?.name || "-";

  return (
    <Sheet open={!!selectedArea} onOpenChange={() => setSelectedArea(null)}>
      <SheetContent side="right" className="data-[side=right]:sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle className="text-xl">{areaName}</SheetTitle>
          <SheetDescription className="text-sm font-medium tracking-widest uppercase">
            Detail Revitalisasi
          </SheetDescription>
        </SheetHeader>

        {isEmpty || !area?.slug ? (
          <Empty />
        ) : (
          <RevitalizationDetailSheet data={data} areaSlug={area.slug} />
        )}
      </SheetContent>
    </Sheet>
  );
}

function Empty() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
      <div className="bg-muted flex size-16 items-center justify-center rounded-full">
        <ClipboardXIcon className="text-muted-foreground size-8" />
      </div>
      <div className="space-y-1">
        <p className="text-foreground text-base font-semibold">
          Belum Ada Data Laporan
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Area ini belum melakukan penginputan laporan <br /> monitoring untuk
          periode ini.
        </p>
      </div>
    </div>
  );
}
