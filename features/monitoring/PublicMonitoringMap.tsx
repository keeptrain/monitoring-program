"use client";

import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { PublicAvailableLocation } from "../dashboard/actions/public-available-locations";
import { ProgressPercentage } from "./components/ProgressPercentage";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import Link from "next/link";
import { LocationType } from "../dashboard/actions/available-locations";
import { iconIsf, iconThematic } from "./components/MapPinIcon";
import { useGetPublicLocationByTypeAndId } from "./api/getPublicLocationByTypeAndId";
import ThematicPublicMonitoringDetail from "../thematic/components/ThematicPublicMonitoringDetail";
import { LoadingPublicMonitoringDetail } from "@/components/shared/LoadingPublicMonitoringDetail";
import { MonitoringDetailTypeMap } from "./types/monitoring-types";

const SHEET_CONTENTS: {
  [K in Exclude<LocationType, "isf">]: React.ComponentType<{
    data: MonitoringDetailTypeMap[K];
  }>;
} = {
  biofloc_thematic: ThematicPublicMonitoringDetail,
  minapadi_thematic: ThematicPublicMonitoringDetail,
  revitalization: ThematicPublicMonitoringDetail,
};

const INDONESIA_CENTER: [number, number] = [-2.5, 118];
const INDONESIA_BOUNDS: [[number, number], [number, number]] = [
  [-11.5, 94.5],
  [6.5, 141.5],
];

export type PublicMonitoringMapProps = {
  locations: PublicAvailableLocation[];
  type: Exclude<LocationType, "isf">;
};

export default function PublicMonitoringMap({
  locations,
  type,
}: PublicMonitoringMapProps) {
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

  const MonitoringDetailContent = SHEET_CONTENTS[type] as React.ComponentType<{
    data: unknown;
  }>;

  return (
    <>
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
          <SheetContent side="right">
            <SheetHeader className="flex">
              <SheetTitle className={cn("invisible", !isLoading && "visible")}>
                {selectedLocation?.location_name}
              </SheetTitle>
              <SheetDescription
                className={cn("invisible", !isLoading && "visible")}
              >
                {selectedLocation?.program_name}
              </SheetDescription>
            </SheetHeader>
            {isLoading ? (
              <LoadingPublicMonitoringDetail />
            ) : (
              <MonitoringDetailContent data={detailData} />
            )}
            <Button
              asChild
              className={cn("invisible", !isLoading && "visible")}
            >
              <Link href={`/monitoring/1/detail`}>
                <span>Ke Halaman Detail</span>
                <ArrowRightIcon />
              </Link>
            </Button>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
