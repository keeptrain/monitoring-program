"use client";

import { PROVINCE_REGIONS } from "@/features/monitoring/constants/monitoring-map-islands-constants";
import { memo } from "react";
import { Polygon, Tooltip } from "react-leaflet";

/**
 * MapIslandHover component
 * Uses Polygon component for a more declarative React-style approach.
 * Optimized with memo to prevent heavy re-renders.
 */
const MapIslandHover = memo(function MapIslandHover({
  stats,
}: {
  stats: Record<string, { count: number; regencies: string[] }>;
}) {
  return (
    <>
      {PROVINCE_REGIONS.map((region) => {
        const data = stats[region.code] || { count: 0, regencies: [] };
        const regencyList =
          data.regencies.length > 0
            ? data.regencies.join(", ")
            : "Belum ada data";

        // Leaflet Polygon expects [lat, lng], but GeoJSON constants are [lng, lat]
        const positions = region.coordinates.map(([lng, lat]) => [
          lat,
          lng,
        ]) as [number, number][];

        return (
          <Polygon
            key={region.code}
            positions={positions}
            pathOptions={{
              fillColor: "transparent",
              stroke: false,
            }}
          >
            <Tooltip direction="top" opacity={1} sticky>
              <div className="w-[380px]">
                {/* Header */}
                <div className="bg-primary grid grid-cols-[140px_1fr] font-semibold text-white">
                  <div className="border-r border-white/20 p-2.5">Provinsi</div>
                  <div className="p-2.5 text-center text-sm">{region.name}</div>
                </div>

                {/* Kabupaten Row */}
                <div className="grid grid-cols-[140px_1fr] border-t border-zinc-200 bg-[#E9EBF5]">
                  <p className="flex items-start border-r border-zinc-300 p-2.5 tracking-tight uppercase">
                    Kabupaten/Kota
                  </p>
                  <p className="p-2.5 leading-relaxed font-medium wrap-break-word whitespace-normal">
                    {regencyList}
                  </p>
                </div>

                {/* Count Row */}
                <div className="grid grid-cols-[140px_1fr] border-t border-zinc-200 bg-white">
                  <p className="flex items-start border-r border-zinc-200 p-2.5 uppercase">
                    Jumlah potensi <br /> KDMP
                  </p>
                  <p className="flex items-center justify-center p-2.5 text-center leading-relaxed font-medium">
                    {data.count}
                  </p>
                </div>
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
});

export default MapIslandHover;
