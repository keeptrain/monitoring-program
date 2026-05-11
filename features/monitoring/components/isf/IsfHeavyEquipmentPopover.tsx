"use client";

import { TractorIcon } from "lucide-react";

export const ISF_EQUIPMENT_DATA = [
  { label: "Excavator", value: 39 },
  { label: "Buldozer", value: 7 },
  { label: "Grader", value: 1 },
  { label: "Vibro", value: 10 },
  { label: "Dumptruck", value: 33 },
  { label: "Fuel Truck", value: 2 },
  { label: "Dutro Truck", value: 1 },
  { label: "Kendaraan Operasional", value: 10 },
];

export function IsfHeavyEquipmentPopover() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
        <TractorIcon className="text-primary size-4" />
        <p className="text-sm font-semibold">Rincian Unit Alat Berat</p>
      </div>
      <div className="grid grid-cols-1 gap-y-1.5">
        {ISF_EQUIPMENT_DATA.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between text-sm transition-colors hover:bg-zinc-50"
          >
            <span className="text-muted-foreground font-medium">
              {item.label}
            </span>
            <span className="inline-flex min-w-[50px] justify-center rounded bg-zinc-100 px-1.5 py-0.5 font-bold text-zinc-900">
              {item.value} Unit
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
