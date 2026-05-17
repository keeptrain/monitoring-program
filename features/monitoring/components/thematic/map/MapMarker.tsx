"use client";

import { Marker, Popup } from "react-leaflet";
import { useQueryState } from "nuqs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import type { PublicAvailableLocation } from "../../../../dashboard/actions/public-available-locations";
import { MapMarkerLocation } from "../../../api/getMonitoringLocationsByType";
import { iconThematic, iconPotential } from "./MapPinIcon";

export default function MapMarker({ locations }: { locations: MapMarkerLocation[] }) {
  const [, setDetailIdUrl] = useQueryState("detailId");

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
