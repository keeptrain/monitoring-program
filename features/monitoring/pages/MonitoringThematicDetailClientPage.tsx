"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const SingleLocationMap = dynamic(
  () => import("@/features/monitoring/components/SingleLocationMap"),
  { ssr: false },
);

export default function MonitoringThematicDetailClientPage({
  lat,
  lng,
  name,
}: {
  lat: number;
  lng: number;
  name: string;
}) {
  const hasCoords = lat !== 0 && lng !== 0;

  return (
    <div className="space-y-8">
      {/* Map */}
      <div className="overflow-hidden border">
        {hasCoords ? (
          <div className="aspect-video w-full">
            <Suspense
              fallback={
                <div className="bg-muted/20 aspect-video w-full animate-pulse" />
              }
            >
              <SingleLocationMap lat={lat} lng={lng} name={name} />
            </Suspense>
          </div>
        ) : (
          <div className="bg-muted/20 flex aspect-video w-full items-center justify-center">
            <p className="text-muted-foreground text-sm">
              Koordinat lokasi tidak tersedia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
