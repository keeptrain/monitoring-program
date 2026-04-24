"use client";

import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPinIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_CENTER: [number, number] = [-2.5, 118];
const DEFAULT_ZOOM = 5;

const pinIcon = L.divIcon({
  html: renderToStaticMarkup(
    <div className="relative flex size-10 items-center justify-center">
      <div className="absolute size-7 rotate-45 rounded-full rounded-br-none border-2 bg-red-600 shadow-sm" />
      <div className="relative z-10 mb-1 flex size-5 items-center justify-center rounded-full bg-white shadow-sm">
        <MapPinIcon className="size-3 text-red-700" />
      </div>
    </div>,
  ),
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// ─── Sub-component: click handler ───────────────────────────────────
function ClickHandler({
  onClick,
  disabled,
}: {
  onClick: (lat: number, lng: number) => void;
  disabled: boolean;
}) {
  useMapEvents({
    click(e) {
      if (disabled) return;
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// ─── Sub-component: sync map center to position ─────────────────────
function FlyToPosition({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const lastFlown = useRef<string>("");

  useEffect(() => {
    const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    if (key === lastFlown.current) return;
    if (lat === 0 && lng === 0) return;

    lastFlown.current = key;
    map.flyTo([lat, lng], Math.max(map.getZoom(), 12), { duration: 0.8 });
  }, [lat, lng, map]);

  return null;
}

// ─── Main Component ────────────────────────────────────────────────
export interface MapPinPickerValue {
  latitude: number;
  longitude: number;
}

interface MapPinPickerProps {
  value: MapPinPickerValue;
  onChange: (value: MapPinPickerValue) => void;
  /** When true, user cannot click on the map to move the pin */
  disabled?: boolean;
  height?: string;
  className?: string;
}

export default function MapPinPicker({
  value,
  onChange,
  disabled = false,
  height = "320px",
  className,
}: MapPinPickerProps) {
  const [locating, setLocating] = useState(false);
  const hasPosition = value.latitude !== 0 || value.longitude !== 0;

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      onChange({ latitude: lat, longitude: lng });
    },
    [onChange],
  );

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [onChange]);

  const center = useMemo<[number, number]>(
    () => (hasPosition ? [value.latitude, value.longitude] : DEFAULT_CENTER),
    [hasPosition, value.latitude, value.longitude],
  );

  return (
    <div className={className}>
      <div
        className="relative overflow-hidden rounded-md border"
        style={{ height }}
      >
        <MapContainer
          center={center}
          zoom={hasPosition ? 12 : DEFAULT_ZOOM}
          scrollWheelZoom={true}
          className="z-0 h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onClick={handleMapClick} disabled={disabled} />
          <FlyToPosition lat={value.latitude} lng={value.longitude} />
          {hasPosition && (
            <Marker
              position={[value.latitude, value.longitude]}
              icon={pinIcon}
              draggable={!disabled}
              eventHandlers={{
                dragend: (e) => {
                  const latlng = e.target.getLatLng();
                  onChange({
                    latitude: latlng.lat,
                    longitude: latlng.lng,
                  });
                },
              }}
            />
          )}
        </MapContainer>

        {/* Locate Me button */}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={locating || disabled}
          className="absolute right-2 bottom-2 z-400 rounded-md border bg-white px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-zinc-50 disabled:opacity-50"
        >
          {locating ? "Mencari..." : "📍 Lokasi Saya"}
        </button>
      </div>
      {!disabled && (
        <p className="text-muted-foreground mt-1 text-[11px]">
          Klik pada peta atau seret pin untuk memilih lokasi.
        </p>
      )}
    </div>
  );
}
