"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import {
  useGetMonitoringLocationsThematic,
  MapMarkerLocation,
} from "../api/getMonitoringLocationsByType";
import { ThematicProgramType } from "@/features/thematic/constants/thematic-constants";
import {
  INDONESIA_BOUNDS,
  INDONESIA_CENTER,
} from "../constants/monitoring-map-constants";
import { MapContainer, TileLayer } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { useRef } from "react";
import MapDetailSheet from "./MapDetailSheet";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { usePathname } from "next/navigation";
import MapTopContent from "./thematic/map/MapTopContent";
import MapMarker from "./thematic/map/MapMarker";

const HoverIslandArea = dynamic(() => import("./thematic/map/MapIslandHover"), {
  ssr: false,
});

export default function MapClient({
  isAuthenticated = false,
}: {
  isAuthenticated: boolean;
}) {
  const pathname = usePathname();
  const programType: ThematicProgramType =
    pathname === "/biofloc-thematic" ? "biofloc_thematic" : "minapadi_thematic";

  const mapRef = useRef<LeafletMap>(null);

  const [statuses] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault(["active"]),
  );

  const showPotential = statuses.includes("potential");

  const {
    data = {
      active: [],
      potential: programType === "biofloc_thematic" ? {} : [],
    },
  } = useGetMonitoringLocationsThematic(programType, statuses);

  const locations = [
    ...data.active,
    ...(programType === "minapadi_thematic"
      ? (data.potential as MapMarkerLocation[])
      : []),
  ];

  const stats =
    programType === "biofloc_thematic"
      ? (data.potential as Record<
          string,
          { count: number; regencies: string[] }
        >)
      : {};

  const handleResetMap = () => {
    if (mapRef.current) {
      mapRef.current.flyTo(INDONESIA_CENTER, 5, { duration: 0.3 });
    }
  };

  return (
    <>
      <MapTopContent
        isAuthenticated={isAuthenticated}
        type={programType}
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
        <MapMarker locations={locations} />
        {isAuthenticated &&
          programType === "biofloc_thematic" &&
          showPotential && <HoverIslandArea stats={stats} />}
      </MapContainer>
      <MapDetailSheet
        type={programType}
        isAuthenticated={isAuthenticated}
        locations={locations}
      />
    </>
  );
}
