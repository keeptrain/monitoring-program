"use client";

import "leaflet/dist/leaflet.css";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import Link from "next/link";
import { LocationType } from "../dashboard/actions/available-locations";
import { iconIsf, iconThematic } from "./components/MapPinIcon";
import { MonitoringDetailTypeMap } from "./actions/public-location";
import { useGetPublicLocationByTypeAndId } from "./api/getPublicLocationByTypeAndId";
import ThematicPublicMonitoringDetail from "../thematic/components/ThematicPublicMonitoringDetail";
import IsfPublicMonitoringDetail from "../isf/components/IsfPublicMonitoringDetail";

const SHEET_CONTENTS: {
  [K in LocationType]: React.ComponentType<{
    data: MonitoringDetailTypeMap[K];
  }>;
} = {
  biofloc_thematic: ThematicPublicMonitoringDetail,
  isf: IsfPublicMonitoringDetail,
};

const INDONESIA_CENTER: [number, number] = [-2.5, 118];
const INDONESIA_BOUNDS: [[number, number], [number, number]] = [
  [-11.5, 94.5],
  [6.5, 141.5],
];

export type PublicMonitoringMapProps = {
  locations: PublicAvailableLocation[];
  type: LocationType;
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

function ArrowButton({
  disabled,
  direction,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
  direction: "left" | "right";
}) {
  const Icon = direction === "left" ? ArrowLeftIcon : ArrowRightIcon;
  return (
    <Button
      disabled={disabled}
      size="icon-sm"
      variant="outline"
      onClick={onClick}
    >
      <Icon className="size-4" />
    </Button>
  );
}

// function DocumentationSection({
//   data,
//   state,
// }: {
//   data: PublicMonitoringDetail;
//   state: ReturnType<typeof useMonitoringPublicSheet>;
// }) {
//   const {
//     documentations,
//     totalDocumentations,
//     activeDocumentationIndex,
//     disabledLeftButton,
//     disabledRightButton,
//     beforeImageUrl,
//     afterImageUrl,
//     handleNextDocumentation,
//     handlePreviousDocumentation,
//   } = state;

//   const {} = data;
//   return (
//     <div className="no-scrollbar space-y-4 overflow-y-auto px-4 pb-4">
//       <div className="border-border bg-background flex items-center justify-between border px-3 py-2">
//         <p className="text-muted-foreground text-xs">
//           Dokumentasi{" "}
//           {totalDocumentations && documentations.length > 0
//             ? `${activeDocumentationIndex + 1}/${totalDocumentations}`
//             : "0/0"}
//         </p>
//         <div className="flex items-center gap-2">
//           <ArrowButton
//             disabled={disabledLeftButton}
//             onClick={handlePreviousDocumentation}
//             direction="left"
//           />
//           <ArrowButton
//             disabled={disabledRightButton}
//             onClick={() => void handleNextDocumentation()}
//             direction="right"
//           />
//         </div>
//       </div>

//       <div className="grid gap-4 sm:grid-cols-2">
//         <DocumentationImageCard
//           title="Sebelum"
//           imageUrl={beforeImageUrl}
//           loading={state.isFetching}
//         />
//         <DocumentationImageCard
//           title="Sesudah"
//           imageUrl={afterImageUrl}
//           loading={state.isFetching}
//         />
//       </div>
//       <div className="flex justify-end"></div>
//     </div>
//   );
// }

function DocumentationImageCard({
  title,
  imageUrl,
  loading,
}: {
  title: string;
  imageUrl: string | null;
  loading: boolean;
}) {
  const altText =
    title === "Sebelum"
      ? "Dokumentasi sebelum pengerjaan"
      : "Dokumentasi sesudah pengerjaan";
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
        {title}
      </p>
      <div className="border-border bg-muted relative aspect-video overflow-hidden border">
        {loading ? (
          <Skeleton className="h-full w-full rounded-none" />
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-xs italic">
            Tidak ada foto
          </div>
        )}
      </div>
    </div>
  );
}
