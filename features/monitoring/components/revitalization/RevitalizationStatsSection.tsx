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

export default function RevitalizationStatsSection() {
  const { ref, isInView } = useInViewOnce<HTMLDivElement>({
    threshold: 0.8,
  });

  const { data: revitalizationStats } = useGetRevitalizationStats(isInView);

  const chartData = revitalizationStats?.chartData || [];
  const summary = revitalizationStats?.summary || {};
  const overallProgress = revitalizationStats?.overallProgress || 0;

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
