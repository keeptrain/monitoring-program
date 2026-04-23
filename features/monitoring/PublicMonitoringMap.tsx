"use client";

import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AlertCircleIcon, ArrowRightIcon, Grid3x3Icon } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { PublicAvailableLocation } from "../dashboard/actions/public-available-locations";
import { ProgressPercentage } from "./components/ProgressPercentage";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LocationType } from "../dashboard/actions/available-locations";
import { iconIsf, iconThematic } from "./components/MapPinIcon";
import { useGetPublicLocationByTypeAndId } from "./api/getPublicLocationByTypeAndId";
import BioflocDetailSheet from "../thematic/components/BioflocDetailSheet";
import { LoadingPublicMonitoringDetail } from "@/components/shared/LoadingPublicMonitoringDetail";
import { MonitoringDetailTypeMap } from "./types/monitoring-types";
import Link from "next/link";

const SHEET_CONTENTS: {
  [K in Exclude<LocationType, "isf">]: React.ComponentType<{
    data: MonitoringDetailTypeMap[K];
  }>;
} = {
  biofloc_thematic: BioflocDetailSheet,
  minapadi_thematic: BioflocDetailSheet,
  revitalization: BioflocDetailSheet,
};

const INDONESIA_CENTER: [number, number] = [-1.2, 118];
const INDONESIA_BOUNDS: [[number, number], [number, number]] = [
  [-11.5, 94.5],
  [6.5, 141.5],
];

import { useGetPublicLocationsByType } from "./api/getPublicLocationsByType";

export type PublicMonitoringMapProps = {
  type: Exclude<LocationType, "isf">;
};

export default function PublicMonitoringMap({
  type,
}: PublicMonitoringMapProps) {
  const { data: locations = [] } = useGetPublicLocationsByType(type);
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const selectedIcon = type === "biofloc_thematic" ? iconThematic : iconIsf;
  const [selectedLocation, setSelectedLocation] =
    useState<PublicAvailableLocation | null>(null);

  const { data: detailData, isLoading } = useGetPublicLocationByTypeAndId(
    type,
    selectedLocation?.id ?? 0,
  );

  const handleDetailClick = (location: PublicAvailableLocation) => {
    setSelectedLocation(location);
    setOpenSheet(true);
  };

  const DetailSheetContent = SHEET_CONTENTS[type] as React.ComponentType<{
    data: unknown;
  }>;

  return (
    <>
      <MapTopContent />
      <MapContainer
        center={INDONESIA_CENTER}
        zoom={5}
        minZoom={3}
        maxBounds={INDONESIA_BOUNDS}
        maxBoundsViscosity={1}
        scrollWheelZoom={true}
        className="absolute inset-0 z-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => {
          return (
            <Marker
              key={location.id}
              icon={selectedIcon}
              position={[
                location.position.latitude,
                location.position.longitude,
              ]}
            >
              <Popup>
                <div className="w-40 space-y-2 sm:w-64">
                  <h3 className="text-sm">
                    {location.location_name} <br />
                    <span className="text-muted-foreground">
                      {location.program_name}
                    </span>
                  </h3>
                  <ProgressPercentage value={location.percentage_of_work} />
                  <Button
                    onClick={() => handleDetailClick(location)}
                    variant="outline"
                  >
                    Detail
                    <ArrowRightIcon />
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {openSheet && (
        <Sheet open={openSheet} onOpenChange={(op) => setOpenSheet(op)}>
          <SheetContent
            side="right"
            className="data-[side=right]:sm:max-w-[600px]"
          >
            <SheetHeader className="flex">
              <SheetTitle
                className={cn("invisible", !isLoading && "visible text-2xl")}
              >
                {selectedLocation?.location_name}
              </SheetTitle>
              <SheetDescription
                className={cn("invisible", !isLoading && "visible text-lg")}
              >
                {selectedLocation?.program_name}
              </SheetDescription>
            </SheetHeader>

            {isLoading ? (
              <LoadingPublicMonitoringDetail />
            ) : (
              <DetailSheetContent data={detailData} />
            )}
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

function MapTopContent() {
  return (
    <>
      <div className="absolute top-3 left-15 z-5 flex items-center gap-4 rounded-sm border border-zinc-200 bg-white/95 backdrop-blur-md">
        <div className="flex items-center gap-4 px-2">
          <div className="flex items-center gap-3">
            <div className="relative flex size-10 items-center justify-center">
              <div className="absolute size-8 rotate-45 rounded-full rounded-bl-none border bg-emerald-600 shadow-sm" />
              <div className="relative z-10 flex size-6 items-center justify-center rounded-full bg-white">
                <Grid3x3Icon className="size-4 text-emerald-700" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] leading-none font-bold tracking-widest text-zinc-400 uppercase">
                KDMP
              </span>
              <span className="text-sm leading-none font-black text-zinc-800">
                100
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-zinc-100" />

          <div className="flex items-center gap-3">
            <div className="relative flex size-10 items-center justify-center">
              <div className="absolute size-8 rotate-45 rounded-full rounded-bl-none border bg-red-600 shadow-sm" />
              <div className="relative z-10 flex size-6 items-center justify-center rounded-full bg-white">
                <AlertCircleIcon className="size-4 text-red-700" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] leading-none font-bold tracking-widest text-zinc-400 uppercase">
                Potensial
              </span>
              <span className="text-sm leading-none font-black text-zinc-800">
                10.000
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-3 right-3 z-5">
        <Button size="lg" asChild>
          <Link href="/monitoring/biofloc_thematic/bantuan-2025">
            Lihat Data
          </Link>
        </Button>
      </div>
    </>
  );
}
