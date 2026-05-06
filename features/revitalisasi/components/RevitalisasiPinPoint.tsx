"use client";

import { cn } from "@/lib/utils";
import {
  REVITALIZATION_AREAS,
  REVITALIZATION_AREA_COLORS,
} from "../constants/revitalization-area";
import { REVITALISASI_PIN_LOCATIONS } from "../constants/revitalization-map";
import { useQueryState } from "nuqs";

export default function RevitalisasiPinPoints() {
  const [, setSelectedArea] = useQueryState("area");

  return (
    <>
      {REVITALIZATION_AREAS.map((area) => (
        <RevitalisasiPinPoint
          key={area.id}
          area={area}
          onClick={() => setSelectedArea(area.slug)}
        />
      ))}
    </>
  );
}

function RevitalisasiPinPoint({
  area,
  onClick,
}: {
  area: (typeof REVITALIZATION_AREAS)[0];
  onClick: () => void;
}) {
  const pos = REVITALISASI_PIN_LOCATIONS[area.id];
  if (!pos) return null;

  return (
    <button
      onClick={onClick}
      className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125"
      style={{ left: pos.x, top: pos.y }}
    >
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            "absolute size-8 animate-ping rounded-full opacity-40",
            REVITALIZATION_AREA_COLORS[area.id] || "bg-primary",
          )}
        />
        <div
          className={cn(
            "relative flex size-6 items-center justify-center rounded-full border-2 border-white text-white shadow-xl",
            REVITALIZATION_AREA_COLORS[area.id] || "bg-primary",
          )}
        >
          <span className="text-[10px] font-bold">{area.id}</span>
        </div>
        <div className="bg-background/90 border-border text-foreground absolute top-full mt-2 hidden min-w-max border px-2 py-1 text-[10px] font-semibold tracking-wide uppercase shadow-lg backdrop-blur lg:group-hover:block">
          {area.name}
        </div>
      </div>
    </button>
  );
}
