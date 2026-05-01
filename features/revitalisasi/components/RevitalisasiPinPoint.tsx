"use client";

import { cn } from "@/lib/utils";
import {
  REVITALISASI_STEPS,
  REVITALISASI_STEP_COLORS,
} from "../constants/revitalisasi-step";
import { REVITALISASI_PIN_LOCATIONS } from "../utils/revitalisasi-constants";

export default function RevitalisasiPinPoints() {
  return (
    <>
      {REVITALISASI_STEPS.map((step) => (
        <RevitalisasiPinPoint
          key={step.id}
          step={step}
          onClick={() => console.log(`Clicked step ${step.id}`)}
        />
      ))}
    </>
  );
}

function RevitalisasiPinPoint({
  step,
  onClick,
}: {
  step: (typeof REVITALISASI_STEPS)[0];
  onClick: () => void;
}) {
  const pos = REVITALISASI_PIN_LOCATIONS[step.id];
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
            REVITALISASI_STEP_COLORS[step.id] || "bg-primary",
          )}
        />
        <div
          className={cn(
            "relative flex size-6 items-center justify-center rounded-full border-2 border-white text-white shadow-xl",
            REVITALISASI_STEP_COLORS[step.id] || "bg-primary",
          )}
        >
          <span className="text-[10px] font-bold">{step.id}</span>
        </div>
        <div className="bg-background/90 border-border text-foreground absolute top-full mt-2 hidden min-w-max border px-2 py-1 text-[10px] font-semibold tracking-wide uppercase shadow-lg backdrop-blur lg:group-hover:block">
          {step.name}
        </div>
      </div>
    </button>
  );
}
