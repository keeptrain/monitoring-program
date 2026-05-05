"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQueryState } from "nuqs";
import { REVITALIZATION_AREAS } from "../../revitalisasi/constants/revitalization-area";
import { useGetMonitoringRevitalization } from "../api/getMonitoringRevitalization";
import MonitoringRevitalizationDetailSheet from "../components/revitalization-detail/MonitoringRevitalizationDetailSheet";
import { ClipboardXIcon } from "lucide-react";

export default function MonitoringRevitalisasiClientPage() {
  return <RevitalizationDetailSheet />;
}

function RevitalizationDetailSheet() {
  const [selectedArea, setSelectedArea] = useQueryState("area");
  const { data, isLoading } = useGetMonitoringRevitalization();

  const area = REVITALIZATION_AREAS.find((a) => a.slug === selectedArea);
  const selectedAreaData = area
    ? data?.data.find((d: any) => d?.area_id === area.id)
    : undefined;

  return (
    <Sheet open={!!area} onOpenChange={() => setSelectedArea(null)}>
      <SheetContent side="right" className="data-[side=right]:sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle className="text-xl">{area?.name}</SheetTitle>
          <SheetDescription className="text-sm font-medium tracking-widest uppercase">
            Detail Monitoring Revitalisasi
          </SheetDescription>
        </SheetHeader>

        {!selectedAreaData && !isLoading ? (
          <EmptyAreaDetail />
        ) : (
          selectedAreaData && (
            <MonitoringRevitalizationDetailSheet data={selectedAreaData} />
          )
        )}
        {isLoading && (
          <p className="text-muted-foreground animate-pulse px-4 text-xs">
            Memuat data...
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
}

function EmptyAreaDetail() {
  return (
    <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center space-y-4 px-6 text-center">
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
