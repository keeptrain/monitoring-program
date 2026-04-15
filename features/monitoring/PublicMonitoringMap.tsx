"use client";

import L, { type LatLngBoundsExpression, type LatLngTuple } from "leaflet";
import { useEffect, useRef } from "react";

const INDONESIA_CENTER: LatLngTuple = [-2.5, 118];
const INDONESIA_BOUNDS: LatLngBoundsExpression = [
  [-11.5, 94.5],
  [6.5, 141.5],
];
const JAKARTA_POSITION: LatLngTuple = [-6.1754, 106.8272];

export default function PublicMonitoringMap() {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const mapElement = mapElementRef.current;

    if (!mapElement || mapRef.current) {
      return;
    }

    const map = L.map(mapElement, {
      center: INDONESIA_CENTER,
      zoom: 5,
      minZoom: 5,
      maxBounds: INDONESIA_BOUNDS,
      maxBoundsViscosity: 1,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.marker(JAKARTA_POSITION)
      .addTo(map)
      .bindPopup("Titik contoh: Jakarta, Indonesia.");

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    resizeObserver.observe(mapElement);
    map.invalidateSize();
    mapRef.current = map;

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div ref={mapElementRef} className="absolute inset-0 z-0 h-full w-full" />
  );
}
