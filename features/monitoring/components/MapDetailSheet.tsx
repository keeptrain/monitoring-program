"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ArrowRightIcon, FolderXIcon } from "lucide-react";
import { useState, startTransition } from "react";
import { useQueryState } from "nuqs";
import { useGetMonitoringLocationByTypeAndId } from "../api/getMonitoringLocationByTypeAndId";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MonitoringThematicDetailSheet from "./thematic/MonitoringThematicDetailSheet";
import { MapMarkerLocation } from "../api/getMonitoringLocationsByType";
import { Skeleton } from "@/components/ui/skeleton";

export default function MapDetailSheet({
  type,
  isAuthenticated,
  locations,
}: {
  type: "biofloc_thematic" | "minapadi_thematic";
  isAuthenticated: boolean;
  locations: MapMarkerLocation[];
}) {
  const [detailIdUrl, setDetailIdUrl] = useQueryState("detailId");
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const currentId = detailIdUrl || activeId;

  if (detailIdUrl && (!isOpen || detailIdUrl !== activeId)) {
    setActiveId(detailIdUrl);
    setIsOpen(true);
  } else if (!detailIdUrl && isOpen) {
    setIsOpen(false);
  }

  const { data: detailData, isPending } = useGetMonitoringLocationByTypeAndId(
    type,
    currentId ?? "",
  );

  const activeLocation = locations.find((l) => l.id.toString() === currentId);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      startTransition(() => {
        setIsOpen(false);
        setDetailIdUrl(null, { scroll: false, history: "replace" });
      });
    }
  };

  const hrefDetail = `/${type.replace("_", "-")}/${currentId}`;

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="data-[side=right]:sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle className="text-xl">
            {activeLocation?.location_name || "-"}
          </SheetTitle>
          <SheetDescription className="text-lg">
            {activeLocation?.province_name || "-"}
          </SheetDescription>
        </SheetHeader>

        <div className="relative min-h-0 flex-1 overflow-y-auto">
          {isPending ? (
            <LoadingPublicMonitoringDetail />
          ) : detailData?.data ? (
            <MonitoringThematicDetailSheet
              isAuthenticated={isAuthenticated}
              type={type}
              data={detailData.data}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <FolderXIcon />
                <p className="text-muted-foreground">Data tidak ditemukan</p>
              </div>
            </div>
          )}
        </div>
        {!isPending && detailData?.data && (
          <SheetFooter className="border-t border-zinc-100 bg-white pt-4">
            <Button asChild className="w-full">
              <Link href={hrefDetail}>
                Data Detail
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

function LoadingPublicMonitoringDetail() {
  return (
    <div className="bg-muted/10 absolute inset-0 z-0">
      <Skeleton className="h-full w-full rounded-none" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="flex space-x-1.5">
          <div className="bg-foreground/30 size-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" />
          <div className="bg-foreground/30 size-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" />
          <div className="bg-foreground/30 size-1.5 animate-bounce rounded-full" />
        </div>
        <span className="text-muted-foreground/50 text-[10px] font-bold tracking-[0.3em] uppercase">
          Memuat Detail
        </span>
      </div>
    </div>
  );
}
