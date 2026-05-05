import { cn } from "@/lib/utils";
import {
  STEPS,
  STEP_COLORS,
  STEP_HEX_COLORS,
} from "@/features/isf/constants/isf-step";
import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import { MonitoringIsf } from "../types/monitoring-types";

export default function OverallSummaryIsf({
  data,
}: {
  data: MonitoringIsf;
}) {
  const { overall_progress, overall_summary } = data;

  return (
    <div className="flex w-full flex-col items-center space-y-8">
      <p className="text-primary text-xs font-black tracking-[0.3em] uppercase">
        Overall Summary
      </p>

      <div className="flex w-full flex-col items-center justify-center gap-6 sm:flex-row">
        <PieChartIsf
          overallProgress={overall_progress}
          summary={overall_summary}
        />

        {/* Progress Grid */}
        <div className="flex w-full flex-1 justify-center gap-x-6 gap-y-8">
          <ProgressGridIsf
            steps={STEPS.filter((s) => s.id <= 4)}
            summary={overall_summary}
          />
          <ProgressGridIsf
            steps={STEPS.filter((s) => s.id >= 5)}
            summary={overall_summary}
          />
        </div>
      </div>
    </div>
  );
}

function PieChartIsf({
  overallProgress,
  summary,
}: {
  overallProgress: number;
  summary: Record<number, number>;
}) {
  const pieData = STEPS.map((s) => ({
    name: s.name,
    value: summary[s.id] || 0,
    fill: STEP_HEX_COLORS[s.id] || "#3b82f6",
  }));

  const totalSteps = STEPS.length;
  const remainingValue = Math.max(
    0,
    totalSteps * 100 - overallProgress * totalSteps,
  );

  const fullData = [
    ...pieData,
    {
      name: "Sisa",
      value: remainingValue,
      fill: "#f1f5f9",
    },
  ];

  return (
    <div style={{ width: 300, height: 200 }}>
      <ResponsiveContainer width={300} height={200}>
        <PieChart>
          <Pie
            data={fullData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={80}
            stroke="none"
            startAngle={90}
            endAngle={450}
            cornerRadius={4}
            paddingAngle={2}
          >
            <Label
              content={({ viewBox }) => {
                const { cx, cy } = viewBox as { cx: number; cy: number };
                return (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    <tspan
                      x={cx}
                      y={cy - 2}
                      className="fill-primary text-2xl font-black italic"
                    >
                      {overallProgress}%
                    </tspan>
                    <tspan
                      x={cx}
                      y={cy + 18}
                      className="fill-muted-foreground text-[10px] font-bold tracking-widest uppercase"
                    >
                      Total
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function ProgressGridIsf({
  steps,
  summary,
}: {
  steps: typeof STEPS;
  summary: Record<number, number>;
}) {
  return (
    <div className="space-y-4">
      {steps.map((s) => {
        const progress = summary[s.id] || 0;
        return (
          <div key={s.id} className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-tight uppercase">
              <span
                className={cn(
                  "flex w-20 justify-center rounded py-1 text-[10px] text-white shadow-xs",
                  STEP_COLORS[s.id] || "bg-primary",
                )}
              >
                Zona {s.id}
              </span>
              <span
                className={cn(
                  "flex w-12 justify-center rounded py-1 text-[10px] font-black text-white tabular-nums shadow-xs",
                  STEP_COLORS[s.id] || "bg-primary",
                )}
              >
                {progress}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
