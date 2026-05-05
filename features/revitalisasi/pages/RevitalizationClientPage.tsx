import {
  REVITALIZATION_AREA_COLORS,
  REVITALIZATION_AREAS,
} from "../constants/revitalization-area";
import ProgramAreaItemCard from "@/components/shared/ProgramAreaItemCard";

const data = REVITALIZATION_AREAS.map((area, index) => ({
  id: `mock-${area.id}`,
  area_id: area.id,
  area_name: area.name,
  progress_percent: [45, 12, 88, 0][index],
  progress_date: new Date().toISOString(),
  total_worker: [120, 45, 200, 0][index],
  status: ["Konstruksi", "Persiapan", "Finishing", "Belum Dimulai"][index],
  updated_at: new Date().toISOString(),
}));

export default function RevitalizationClientPage() {
  return (
    <>
      {REVITALIZATION_AREAS.map((area) => {
        const areaData = data.find((d) => d?.area_id === area.id);
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
