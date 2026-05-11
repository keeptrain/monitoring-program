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
import {
  AlertCircleIcon,
  ArrowRightIcon,
  FishIcon,
  FolderXIcon,
  LocateFixedIcon,
} from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from "react-leaflet";
import type { PublicAvailableLocation } from "../dashboard/actions/public-available-locations";
import { ProgressPercentage } from "./components/ProgressPercentage";
import { Button } from "@/components/ui/button";
import { LocationType } from "../dashboard/actions/available-locations";
import { MapPin, iconThematic, iconPotential } from "./components/MapPinIcon";
import { useGetMonitoringLocationByTypeAndId } from "./api/getMonitoringLocationByTypeAndId";
import BioflocDetailSheet from "./components/biofloc-detail/BioflocDetailSheet";
import { LoadingPublicMonitoringDetail } from "@/components/shared/LoadingPublicMonitoringDetail";
import { MonitoringDetailTypeMap } from "./types/monitoring-types";
import Link from "next/link";
import {
  getLocationsQueryKey,
  useGetMonitoringLocationsByType,
  useGetMonitoringLocationsCombined,
  LocationStatus,
} from "./api/getMonitoringLocationsByType";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import type { Map as LeafletMap } from "leaflet";
import { useRef, startTransition, useState } from "react";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { Checkbox } from "@/components/ui/checkbox";
import { usePathname } from "next/navigation";

const INDONESIA_CENTER: [number, number] = [-1.2, 118] as const;
const INDONESIA_BOUNDS: [[number, number], [number, number]] = [
  [-11.5, 94.5],
  [6.5, 141.5],
] as const;

const SHEET_CONTENTS: {
  [K in "biofloc_thematic" | "minapadi_thematic"]: React.ComponentType<{
    data: MonitoringDetailTypeMap[K];
    isAuthenticated: boolean;
  }>;
} = {
  biofloc_thematic: BioflocDetailSheet,
  minapadi_thematic: BioflocDetailSheet,
};

const typeMap: Record<string, "biofloc_thematic" | "minapadi_thematic"> = {
  "/biofloc-thematic": "biofloc_thematic",
  "/minapadi-thematic": "minapadi_thematic",
};

export interface PublicMonitoringMapProps {
  isAuthenticated?: boolean;
}

export default function MapClient({
  isAuthenticated = false,
}: PublicMonitoringMapProps) {
  const pathname = usePathname();
  const type = typeMap[pathname] || "biofloc_thematic";
  const mapRef = useRef<LeafletMap>(null);

  const handleResetMap = () => {
    if (mapRef.current) {
      mapRef.current.flyTo(INDONESIA_CENTER, 5, { duration: 0.3 });
    }
  };

  return (
    <>
      <MapTopContent
        isAuthenticated={isAuthenticated}
        type={type}
        resetMap={handleResetMap}
      />
      <MapContainer
        ref={mapRef}
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
        <MapMarker type={type} />
        {/* {isAuthenticated && type === "biofloc_thematic" && <MapIslands />} */}
      </MapContainer>
      <MapDetailSheet type={type} isAuthenticated={isAuthenticated} />
    </>
  );
}

function MapTopContent({
  isAuthenticated,
  type,
  resetMap,
}: {
  isAuthenticated: boolean;
  type: LocationType;
  resetMap: () => void;
}) {
  const [statuses, setStatuses] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault(["active"]),
  );

  const { data: kdmpCount, isPending } = useGetMonitoringLocationsByType(
    type,
    "active",
  );

  const showActive = statuses.includes("active");
  const showPotential = statuses.includes("potential");

  const activeLagendaLabel = type === "biofloc_thematic" ? "KDMP" : "POKDAKA";

  const handleToggleActive = (checked: boolean) => {
    if (checked) {
      setStatuses([...statuses, "active"], { scroll: false });
    } else {
      setStatuses(
        statuses.filter((s) => s !== "active"),
        { scroll: false },
      );
    }
  };

  const handleTogglePotential = (checked: boolean) => {
    if (checked) {
      setStatuses([...statuses, "potential"], { scroll: false });
    } else {
      setStatuses(
        statuses.filter((s) => s !== "potential"),
        { scroll: false },
      );
    }
  };

  const LegendWrapper = isAuthenticated ? "label" : "div";

  const potentialValue = `30.000`; // Todo: count potential

  return (
    <>
      <div className="bg-secondary absolute top-3 left-15 z-1 border border-zinc-200 shadow-xs">
        <div className="flex items-center">
          <LegendWrapper
            className={cn(
              "flex items-center gap-2 px-2 transition-colors select-none",
              isAuthenticated
                ? "cursor-pointer hover:bg-zinc-100"
                : "cursor-default",
            )}
          >
            {isAuthenticated && type === "minapadi_thematic" && (
              <Checkbox
                checked={showActive}
                onCheckedChange={(c) => handleToggleActive(!!c)}
              />
            )}
            <div className="flex items-center gap-1">
              <MapPin
                bgColor="bg-emerald-600"
                icon={FishIcon}
                iconColor="text-emerald-700"
                className="pb-1"
              />
              <div className="flex flex-col gap-1">
                <span className="text-[9px] leading-none font-bold tracking-widest text-zinc-400 uppercase">
                  {activeLagendaLabel}
                </span>
                <span className="text-sm leading-none font-semibold">
                  {isPending ? (
                    <Skeleton className="h-4 w-6" />
                  ) : (
                    kdmpCount?.length
                  )}
                </span>
              </div>
            </div>
          </LegendWrapper>

          <LegendWrapper
            className={cn(
              "flex items-center gap-2 px-2 transition-colors select-none",
              isAuthenticated
                ? "cursor-pointer hover:bg-zinc-100"
                : "cursor-default",
            )}
          >
            {isAuthenticated && type === "minapadi_thematic" && (
              <Checkbox
                checked={showPotential}
                onCheckedChange={(c) => handleTogglePotential(!!c)}
              />
            )}
            <div className="flex items-center gap-1">
              {type === "minapadi_thematic" && (
                <MapPin
                  bgColor="bg-red-600"
                  icon={AlertCircleIcon}
                  iconColor="text-red-700"
                  className="pb-1"
                />
              )}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] leading-none font-bold tracking-widest text-zinc-400 uppercase">
                  Target
                </span>
                <span className="text-sm leading-none font-semibold">
                  {isAuthenticated ? potentialValue : "30.000"}
                </span>
              </div>
            </div>
          </LegendWrapper>
        </div>
      </div>
      <div className="absolute top-3 right-3 z-5 flex items-center gap-2">
        <Button size="lg" variant="secondary" asChild>
          <Link href="/biofloc-thematic/data">Lihat Data</Link>
        </Button>
      </div>
      <div className="absolute right-3 bottom-7 z-5">
        <Button
          size="icon-lg"
          variant="secondary"
          onClick={resetMap}
          title="Reset Posisi Peta"
        >
          <LocateFixedIcon className="size-4 text-zinc-600" />
        </Button>
      </div>
    </>
  );
}

function MapDetailSheet({
  type,
  isAuthenticated,
}: {
  type: "biofloc_thematic" | "minapadi_thematic";
  isAuthenticated: boolean;
}) {
  const queryClient = useQueryClient();
  const [detailIdUrl, setDetailIdUrl] = useQueryState(
    "detailId",
    parseAsString,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  if (detailIdUrl && (!isOpen || detailIdUrl !== activeId)) {
    setActiveId(detailIdUrl);
    setIsOpen(true);
  } else if (!detailIdUrl && isOpen) {
    setIsOpen(false);
  }

  const { data: detailData, isLoading } = useGetMonitoringLocationByTypeAndId(
    type,
    activeId ?? "",
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

  const selectedLocation = activeId
    ? locations.find((l) => l.id.toString() === activeId)
    : null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      startTransition(() => {
        setIsOpen(false);
        setDetailIdUrl(null, { scroll: false, history: "replace" });
      });
    }
  };

  const DetailSheetContent = SHEET_CONTENTS[type];

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="data-[side=right]:sm:max-w-[600px]">
        <SheetHeader className="flex">
          <SheetTitle
            className={cn("invisible", !isLoading && "visible text-2xl")}
          >
            {selectedLocation && selectedLocation.location_name}
          </SheetTitle>
          <SheetDescription
            className={cn("invisible", !isLoading && "visible text-lg")}
          >
            {selectedLocation && selectedLocation.province_name}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <LoadingPublicMonitoringDetail />
        ) : selectedLocation || detailData ? (
          <DetailSheetContent
            data={detailData!}
            isAuthenticated={isAuthenticated}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <FolderXIcon />
              <p className="text-muted-foreground">Data tidak ditemukan</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function MapMarker({
  type,
}: {
  type: "biofloc_thematic" | "minapadi_thematic";
}) {
  const [, setDetailIdUrl] = useQueryState("detailId", parseAsString);
  const [statuses] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault(["active"]),
  );

  const { data: locations = [] } = useGetMonitoringLocationsCombined(
    type,
    statuses as LocationStatus[],
  );

  const handleLocationDetailClick = (location: PublicAvailableLocation) => {
    setDetailIdUrl(location.id.toString(), { scroll: false });
  };

  return (
    <>
      {locations.map((location) => {
        return (
          <Marker
            key={location.id}
            icon={location.isPotential ? iconPotential : iconThematic}
            position={[location.position.latitude, location.position.longitude]}
          >
            <Popup>
              <MapPopUpContent
                location={location}
                onDetailClick={handleLocationDetailClick}
              />
            </Popup>
          </Marker>
        );
      })}
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
        <span className="text-muted-foreground">{location.province_name}</span>
      </h3>
      <ProgressPercentage value={location.progress_percent} />
      <Button onClick={() => onDetailClick(location)} variant="outline">
        Detail
        <ArrowRightIcon />
      </Button>
    </div>
  );
}

// const DUMMY_KALIMANTAN_GEOJSON = {
//   type: "FeatureCollection",
//   features: [
//     {
//       type: "Feature",
//       properties: { name: "Kalimantan Barat", total: 5, status: "Aktif" },
//       geometry: {
//         type: "Polygon",
//         coordinates: [
//           [
//             [108.8, 2.0],
//             [112.0, 2.0],
//             [112.0, -3.0],
//             [108.8, -3.0],
//             [108.8, 2.0],
//           ],
//         ],
//       },
//     },
//     {
//       type: "Feature",
//       properties: { name: "Kalimantan Timur", total: 7, status: "Aktif" },
//       geometry: {
//         type: "Polygon",
//         coordinates: [
//           [
//             [114.0, 3.0],
//             [119.0, 3.0],
//             [119.0, -2.0],
//             [114.0, -2.0],
//             [114.0, 3.0],
//           ],
//         ],
//       },
//     },
//   ],
// } as any;

// function MapIslands() {
//   const onEachFeature = (feature: any, layer: any) => {
//     if (feature.properties && feature.properties.name) {
//       layer.bindTooltip(
//         `
//         <div class="p-1 space-y-1">
//           <p class="text-xs font-bold">${feature.properties.name}</p>
//           <div class="grid grid-cols-2 gap-x-2 text-[10px]">
//             <span class="text-zinc-500">Total:</span>
//             <span class="font-semibold">${feature.properties.total} Lokasi</span>
//             <span class="text-zinc-500">Status:</span>
//             <span class="font-semibold text-emerald-600">${feature.properties.status}</span>
//           </div>
//         </div>
//       `,
//         { sticky: true, direction: "top", opacity: 1 },
//       );
//     }
//   };

//   return (
//     <GeoJSON
//       data={DUMMY_KALIMANTAN_GEOJSON}
//       onEachFeature={onEachFeature}
//       style={{
//         stroke: false,
//         fillColor: "#00000000",
//       }}
//     />
//   );
// }
