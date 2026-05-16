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
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useState, startTransition } from "react";
import { useQueryState } from "nuqs";
import { useGetMonitoringLocationByTypeAndId } from "../api/getMonitoringLocationByTypeAndId";
import { getLocationsQueryKey } from "../api/getMonitoringLocationsByType";
import type { PublicAvailableLocation } from "../../dashboard/actions/public-available-locations";
import { LoadingPublicMonitoringDetail } from "@/components/shared/LoadingPublicMonitoringDetail";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MonitoringThematicDetailSheet from "./thematic/MonitoringThematicDetailSheet";

export default function MapDetailSheet({
  type,
  isAuthenticated,
}: {
  type: "biofloc_thematic" | "minapadi_thematic";
  isAuthenticated: boolean;
}) {
  const queryClient = useQueryClient();
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

  const activeLocations =
    queryClient.getQueryData<PublicAvailableLocation[]>(
      getLocationsQueryKey(type, "active"),
    ) ?? [];

  const potentialLocations =
    queryClient.getQueryData<PublicAvailableLocation[]>(
      getLocationsQueryKey(type, "potential"),
    ) ?? [];

  const locations = [...activeLocations, ...potentialLocations];

  const selectedLocation = currentId
    ? locations.find((l) => l.id.toString() === currentId)
    : null;

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
        <SheetHeader className="flex">
          <SheetTitle
            className={cn("invisible", !isPending && "visible text-2xl")}
          >
            {selectedLocation && selectedLocation.location_name}
          </SheetTitle>
          <SheetDescription
            className={cn("invisible", !isPending && "visible text-lg")}
          >
            {selectedLocation && selectedLocation.province_name}
          </SheetDescription>
        </SheetHeader>

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
        {detailData && (
          <SheetFooter>
            <Button asChild>
              <Link href={hrefDetail}>
                Data Detail
                <ArrowRightIcon />
              </Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
