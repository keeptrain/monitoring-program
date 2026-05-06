"use client";

import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useGetRevitalizationStats } from "../../api/getRevitalizationStats";
import {
  REVITALIZATION_AREAS,
  REVITALIZATION_AREA_COLORS,
  REVITALIZATION_AREA_HEX_COLORS,
} from "../../../revitalisasi/constants/revitalization-area";
import OverallSummary from "../shared/OverallSummary";
import ProgressChart from "../shared/ProgressChart";

const chartData = [
  { name: "Jan", z1: 10, z2: 8, z3: 5, z4: 12 },
  { name: "Feb", z1: 25, z2: 18, z3: 15, z4: 28 },
  { name: "Mar", z1: 40, z2: 35, z3: 30, z4: 42 },
  { name: "Apr", z1: 55, z2: 48, z3: 45, z4: 58 },
  { name: "May", z1: 70, z2: 65, z3: 60, z4: 75 },
  { name: "Jun", z1: 85, z2: 80, z3: 78, z4: 88 },
  { name: "Jul", z1: 95, z2: 92, z3: 90, z4: 98 },
];

const summary: Record<number, number> = {
  1: 85,
  2: 70,
  3: 90,
  4: 57,
};

const overallProgress = 75.5;

export default function RevitalizationStatsSection() {
  const { ref, isInView } = useInViewOnce<HTMLDivElement>({
    threshold: 0.8,
  });

  const stats = useGetRevitalizationStats(isInView);

  const revitalizationSeriesConfig = REVITALIZATION_AREAS.map((area) => ({
    key: `z${area.id}`,
    label: area.name.replace("Kabupaten ", ""),
    color: REVITALIZATION_AREA_HEX_COLORS[area.id] || "#3b82f6",
    dash: "0",
    dotRadius: 4,
  }));

  return (
    <div className="mx-auto w-full max-w-6xl px-6 sm:px-0">
      <div
        ref={ref}
        className="grid grid-cols-1 items-start gap-16 py-12 lg:grid-cols-2"
      >
        {/* Overall Summary Column */}
        <div className="flex w-full flex-col items-center space-y-8">
          <p className="text-primary text-xs font-black tracking-[0.3em] uppercase">
            Overall Summary
          </p>
          <OverallSummary
            isVisible={isInView}
            data={{ overallProgress, summary }}
            config={{
              areas: REVITALIZATION_AREAS,
              areaColors: REVITALIZATION_AREA_COLORS,
              areaHexColors: REVITALIZATION_AREA_HEX_COLORS,
            }}
          />
        </div>

        {/* Progress Chart Column */}
        <div className="flex w-full flex-col items-center space-y-8">
          <p className="text-primary text-xs font-black tracking-[0.3em] uppercase">
            Grafik Progress
          </p>
          <ProgressChart
            isVisible={isInView}
            data={{ chartData }}
            config={{ seriesConfig: revitalizationSeriesConfig }}
          />
        </div>
      </div>
    </div>
  );
}
