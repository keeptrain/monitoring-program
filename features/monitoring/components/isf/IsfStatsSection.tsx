"use client";

import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useGetIsfStats } from "../../api/getIsfStats";
import {
  STEPS,
  STEP_COLORS,
  STEP_HEX_COLORS,
} from "../../../isf/constants/isf-step";
import OverallSummary from "../shared/OverallSummary";
import ProgressChart from "../shared/ProgressChart";

export default function IsfStatsSection() {
  const { ref, isInView } = useInViewOnce<HTMLDivElement>({
    threshold: 0.1,
  });

  const stats = useGetIsfStats(isInView);

  const chartData = stats.data?.chartData || [];
  const summary = stats.data?.summary || {};
  const overallProgress = stats.data?.overallProgress || 0;

  const isfSeriesConfig = STEPS.map((step) => ({
    key: `z${step.id}`,
    label: `Zona ${step.id}`,
    color: STEP_HEX_COLORS[step.id] || "#3b82f6",
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
              areas: STEPS.map((s) => ({ id: s.id, name: s.name })),
              areaColors: STEP_COLORS,
              areaHexColors: STEP_HEX_COLORS,
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
            config={{ seriesConfig: isfSeriesConfig }}
          />
        </div>
      </div>
    </div>
  );
}
