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
import { AlertCircleIcon, ArrowRightIcon, FishIcon } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { PublicAvailableLocation } from "../dashboard/actions/public-available-locations";
import { ProgressPercentage } from "./components/ProgressPercentage";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LocationType } from "../dashboard/actions/available-locations";
import { MapPin, iconThematic } from "./components/MapPinIcon";
import { useGetPublicLocationByTypeAndId } from "./api/getPublicLocationByTypeAndId";
import BioflocDetailSheet from "./components/biofloc-detail/BioflocDetailSheet";
import { LoadingPublicMonitoringDetail } from "@/components/shared/LoadingPublicMonitoringDetail";
import { MonitoringDetailTypeMap } from "./types/monitoring-types";
import Link from "next/link";
import { useGetPublicLocationsByType } from "./api/getPublicLocationsByType";

const INDONESIA_CENTER: [number, number] = [-1.2, 118] as const;
const INDONESIA_BOUNDS: [[number, number], [number, number]] = [
  [-11.5, 94.5],
  [6.5, 141.5],
] as const;

const SHEET_CONTENTS: {
  [K in Exclude<LocationType, "isf">]: React.ComponentType<{
    data: MonitoringDetailTypeMap[K];
  }>;
} = {
  biofloc_thematic: BioflocDetailSheet,
  minapadi_thematic: BioflocDetailSheet,
  revitalization: BioflocDetailSheet,
};

export type PublicMonitoringMapProps = {
  type: Exclude<LocationType, "isf">;
};

export default function PublicMonitoringMap({
  type,
}: PublicMonitoringMapProps) {
  const [selectedLocation, setSelectedLocation] =
    useState<PublicAvailableLocation | null>(null);
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const { data: locations = [] } = useGetPublicLocationsByType(type);
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
      {type === "biofloc_thematic" && (
        <MapTopContent kdmpCount={locations.length} />
      )}
      <MapContainer
        center={INDONESIA_CENTER}
        maxBounds={INDONESIA_BOUNDS}
        zoom={5}
        minZoom={3}
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
              icon={iconThematic}
              position={[
                location.position.latitude,
                location.position.longitude,
              ]}
            >
              <Popup>
                <MapPopUpContent
                  location={location}
                  onDetailClick={handleDetailClick}
                />
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

function MapTopContent({ kdmpCount }: { kdmpCount: number }) {
  return (
    <>
      <div className="absolute top-3 left-15 z-1 border border-zinc-300 bg-white shadow-xs">
        <div className="flex items-center gap-2 px-3 py-1">
          <div className="flex items-center gap-1">
            <MapPin
              bgColor="bg-emerald-600"
              icon={FishIcon}
              iconColor="text-emerald-700"
              className="pb-1"
            />
            <div className="flex flex-col gap-1">
              <span className="text-[9px] leading-none font-bold tracking-widest text-zinc-400 uppercase">
                KDMP
              </span>
              <span className="text-sm leading-none font-semibold">
                {kdmpCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <MapPin
              bgColor="bg-red-600"
              icon={AlertCircleIcon}
              iconColor="text-red-700"
              className="pb-1"
            />
            <div className="flex flex-col gap-1">
              <span className="text-[9px] leading-none font-bold tracking-widest text-zinc-400 uppercase">
                Potensi
              </span>
              <span className="text-sm leading-none font-semibold">10.000</span>
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

function MapPopUpContent({
  location,
  onDetailClick,
}: {
  location: PublicAvailableLocation;
  onDetailClick: (location: PublicAvailableLocation) => void;
}) {
  return (
    <div className="w-40 space-y-2 sm:w-64">
      <h3 className="text-sm">
        {location.location_name} <br />
        <span className="text-muted-foreground">{location.program_name}</span>
      </h3>
      <ProgressPercentage value={location.progress_percent} />
      <Button onClick={() => onDetailClick(location)} variant="outline">
        Detail
        <ArrowRightIcon />
      </Button>
    </div>
  );
}
