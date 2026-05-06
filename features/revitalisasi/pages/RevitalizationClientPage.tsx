"use client";

import {
  REVITALIZATION_AREA_COLORS,
  REVITALIZATION_AREAS,
} from "../constants/revitalization-area";
import ProgramAreaItemCard from "@/components/shared/ProgramAreaItemCard";
import { useGetRevitalizationAreasLatest } from "../api/getRevitalizationAreasLatest";

export default function RevitalizationClientPage() {
  const { data } = useGetRevitalizationAreasLatest();

  return (
    <>
      {REVITALIZATION_AREAS.map((area) => {
        const areaData = data?.find((d) => d.area_id === area.id);
        return (
          <ProgramAreaItemCard
            key={area.id}
            href={`/dashboard/revitalisasi/${area.slug}`}
            badgeLabel="Area"
            badgeNumber={area.id}
            badgeColorClass={
              REVITALIZATION_AREA_COLORS[area.id] || "bg-primary"
            }
            title={area.name}
            lastUpdatedAt={areaData?.updated_at}
            progressPercent={areaData?.progress_percent || 0}
          />
        );
      })}
    </>
  );
}
