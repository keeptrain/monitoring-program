"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  FishIcon,
  LocateFixedIcon,
} from "lucide-react";
import {
  useGetMonitoringLocationsByType,
  useGetMonitoringLocationsCombined,
  LocationStatus,
} from "../api/getMonitoringLocationsByType";
import {
  INDONESIA_BOUNDS,
  INDONESIA_CENTER,
  typeMap,
} from "../constants/monitoring-map-constants";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { PublicAvailableLocation } from "../../dashboard/actions/public-available-locations";
import { Button } from "@/components/ui/button";
import { LocationType } from "../../dashboard/actions/available-locations";
import { MapPin, iconThematic, iconPotential } from "./thematic/map/MapPinIcon";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { Map as LeafletMap } from "leaflet";
import { useRef } from "react";
import MapDetailSheet from "./MapDetailSheet";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { Checkbox } from "@/components/ui/checkbox";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";

const HoverIslandArea = dynamic(() => import("./thematic/map/MapIslandHover"), {
  ssr: false,
});

export default function MapClient({
  isAuthenticated = false,
}: {
  isAuthenticated: boolean;
}) {
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
        className="absolute inset-0 z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapMarker type={type} />
        {isAuthenticated && type === "biofloc_thematic" && <HoverIslandArea />}
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
  const hrefData =
    type === "biofloc_thematic"
      ? "/biofloc-thematic/data"
      : "/minapadi-thematic/data";

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
            {isAuthenticated && (
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
          <Link href={hrefData}>Lihat Data</Link>
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

function MapMarker({
  type,
}: {
  type: "biofloc_thematic" | "minapadi_thematic";
}) {
  const [, setDetailIdUrl] = useQueryState("detailId");
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
      <div className="flex items-center justify-between gap-4">
        <Progress value={location.progress_percent} className="h-3 flex-1" />
        <span className="font-bold tabular-nums">
          {location.progress_percent}%
        </span>
      </div>
      <Button onClick={() => onDetailClick(location)} variant="outline">
        Detail
        <ArrowRightIcon />
      </Button>
    </div>
  );
}
