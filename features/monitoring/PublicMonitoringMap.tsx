"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Image from "next/image";
import { renderToStaticMarkup } from "react-dom/server";
import { cn, formatDateWithTime } from "@/lib/utils";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FishIcon,
  LucideIcon,
} from "lucide-react";
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
import { useDocumentationsSheet } from "./hooks/useDocumentationsSheet";
import { useState } from "react";

const createPinIcon = (
  IconComponent: LucideIcon,
  bgColor: string = "bg-rose-500"
) => {
  return L.divIcon({
    html: renderToStaticMarkup(
      <div className="relative flex items-center justify-center">
        <div className="relative flex size-10 items-center justify-center">
          <div
            className={cn(
              "absolute size-9 rotate-45 rounded-full rounded-bl-none border-2 transition-transform hover:scale-110 shadow-sm",
              bgColor
            )}
          />
          {/* White inner circle */}
          <div className="relative z-10 flex size-6 items-center bg-white justify-center rounded-full   shadow-sm">
            <IconComponent className="size-4 text-cyan-700" />
          </div>
        </div>
      </div>
    ),
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

const iconX = createPinIcon(FishIcon, "bg-cyan-600");

const INDONESIA_CENTER: [number, number] = [-2.5, 118];
const INDONESIA_BOUNDS: [[number, number], [number, number]] = [
  [-11.5, 94.5],
  [6.5, 141.5],
];

export type PublicMonitoringMapProps = {
  locations: PublicAvailableLocation[];
};

export default function PublicMonitoringMap({
  locations,
}: PublicMonitoringMapProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] =
    useState<PublicAvailableLocation | null>(null);

  const documentationState = useDocumentationsSheet(selectedLocation?.id);

  const handleDetailClick = (location: PublicAvailableLocation) => {
    setSelectedLocation(location);
    setOpen(true);
  };

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
              icon={iconX}
              position={[
                location.position.latitude,
                location.position.longitude,
              ]}
            >
              <Popup>
                <div className="space-y-2">
                  <h3 className="text-sm">
                    {location.location_name} <br />
                    <span className="text-muted-foreground">
                      {location.program_name}
                    </span>
                  </h3>
                  <ProgressPercentage value={location.percentage_of_work} />
                  <Button
                    onClick={() => {
                      handleDetailClick(location);
                      setOpen(true);
                    }}
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

      {open && (
        <Sheet open={open} onOpenChange={(op) => setOpen(op)}>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-hidden">
            <SheetHeader>
              <SheetTitle>{selectedLocation?.location_name}</SheetTitle>
              <SheetDescription>
                {selectedLocation?.program_name}
              </SheetDescription>
            </SheetHeader>
            {documentationState.isLoadingDocumentation ? (
              <LoadingPublicMonitoringDetail />
            ) : (
              <DocumentationSection state={documentationState} />
            )}
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

function LoadingPublicMonitoringDetail() {
  return (
    <div className="absolute inset-0 z-0 bg-muted/10">
      <Skeleton className="h-full w-full rounded-none" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="flex space-x-1.5">
          <div className="size-1.5 animate-bounce rounded-full bg-foreground/30 [animation-delay:-0.3s]" />
          <div className="size-1.5 animate-bounce rounded-full bg-foreground/30 [animation-delay:-0.15s]" />
          <div className="size-1.5 animate-bounce rounded-full bg-foreground/30" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50">
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

function DocumentationSection({
  state,
}: {
  state: ReturnType<typeof useDocumentationsSheet>;
}) {
  const {
    totalDocumentations,
    documentations,
    activeDocumentationIndex,
    disabledLeftButton,
    disabledRightButton,
    activeDocumentation,
    isCurrentDocumentationLoading,
    beforeImageUrl,
    afterImageUrl,
    handleNextDocumentation,
    handlePreviousDocumentation,
  } = state;
  return (
    <div className="no-scrollbar space-y-4 overflow-y-auto px-4 pb-4">
      <div className="flex items-center justify-between border border-border bg-background px-3 py-2">
        <p className="text-xs text-muted-foreground">
          Dokumentasi{" "}
          {totalDocumentations && documentations.length > 0
            ? `${activeDocumentationIndex + 1}/${totalDocumentations}`
            : "0/0"}
        </p>
        <div className="flex items-center gap-2">
          <ArrowButton
            disabled={disabledLeftButton}
            onClick={handlePreviousDocumentation}
            direction="left"
          />
          <ArrowButton
            disabled={disabledRightButton}
            onClick={() => void handleNextDocumentation()}
            direction="right"
          />
        </div>
      </div>

      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
        <div className="border border-border px-3 py-2">
          <p className="font-medium text-foreground">Dibuat</p>
          <p>{formatDateWithTime(activeDocumentation?.created_at)}</p>
        </div>
        <div className="border border-border px-3 py-2">
          <p className="font-medium text-foreground">Diperbarui</p>
          <p>{formatDateWithTime(activeDocumentation?.updated_at)}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DocumentationImageCard
          title="Sebelum"
          imageUrl={beforeImageUrl}
          loading={isCurrentDocumentationLoading}
        />
        <DocumentationImageCard
          title="Sesudah"
          imageUrl={afterImageUrl}
          loading={isCurrentDocumentationLoading}
        />
      </div>
    </div>
  );
}

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
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="relative aspect-video overflow-hidden border border-border bg-muted">
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
          <div className="flex h-full items-center justify-center text-xs italic text-muted-foreground">
            Tidak ada foto
          </div>
        )}
      </div>
    </div>
  );
}
