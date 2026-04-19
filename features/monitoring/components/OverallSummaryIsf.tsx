import { cn } from "@/lib/utils";
import {
  STEPS,
  STEP_COLORS,
  STEP_HEX_COLORS,
} from "@/features/isf/constants/isf-step";
import { Progress } from "@/components/ui/progress";
import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import { PublicMonitoringIsf } from "../types/monitoring-types";

export default function OverallSummaryIsf({
  data,
}: {
  data: PublicMonitoringIsf;
}) {
  const { overall_progress, overall_summary } = data;

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-8">
      <p className="text-primary text-xs font-black tracking-[0.3em] uppercase">
        Overall Summary
      </p>

      <div className="flex w-full flex-col items-center justify-center gap-12 sm:flex-row lg:gap-20">
        <PieChartIsf
          overallProgress={overall_progress}
          summary={overall_summary}
        />

        {/* Progress Grid */}
        <div className="grid w-full flex-1 grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
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
      <ResponsiveContainer>
        <PieChart width={300} height={200}>
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
            <div className="flex justify-between gap-3 text-sm font-bold tracking-tight uppercase">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "size-1.5 rounded-full shadow-sm",
                    STEP_COLORS[s.id] || "bg-primary",
                  )}
                />
                <span className="text-foreground/70">Zona {s.id}</span>
              </div>
              <span className="text-primary font-semibold tabular-nums">
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-2 w-full" />
          </div>
        );
      })}
    </div>
  );
}
