"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface AreaConfig {
  id: number;
  name: string;
}

interface OverallSummaryProps {
  isVisible: boolean;
  data: {
    overallProgress: number;
    summary: Record<number, number>;
  };
  config: {
    areas: AreaConfig[];
    areaColors: Record<number, string>;
    areaHexColors: Record<number, string>;
  };
}

export default function OverallSummary({
  isVisible,
  data,
  config,
}: OverallSummaryProps) {
  const { overallProgress, summary } = data;
  const { areas, areaColors, areaHexColors } = config;

  const pieData = areas.map((a) => ({
    name: a.name,
    value: summary[a.id] || 0,
    fill: areaHexColors[a.id] || "#3b82f6",
  }));

  const totalPossible = areas.length * 100;
  const remainingValue = Math.max(
    0,
    totalPossible - overallProgress * areas.length,
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
    <div className="flex w-full flex-col items-center">
      {!isVisible ? (
        <IsNotInViewSkeleton hasManyAreas={areas.length > 4} />
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-6 sm:flex-row">
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

          {/* Progress Grid */}
          <div className="flex flex-1 justify-center gap-2">
            <div className="space-y-3">
              {(areas.length > 4
                ? areas.slice(0, Math.ceil(areas.length / 2))
                : areas
              ).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-1.5 text-sm font-semibold tracking-tight uppercase"
                >
                  <span
                    className={cn(
                      "flex h-8 w-28 items-center justify-center rounded px-2 text-center text-[9px] text-white shadow-xs",
                      areaColors[a.id] || "bg-primary",
                    )}
                    title={a.name.replace("Kabupaten ", "")}
                  >
                    <span className="truncate">
                      {a.name.replace("Kabupaten ", "")}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "flex h-8 w-11 items-center justify-center rounded text-[10px] font-black text-white tabular-nums shadow-xs",
                      areaColors[a.id] || "bg-primary",
                    )}
                  >
                    {summary[a.id]}%
                  </span>
                </div>
              ))}
            </div>
            {areas.length > 4 && (
              <div className="space-y-3">
                {areas.slice(Math.ceil(areas.length / 2)).map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-1.5 text-sm font-semibold tracking-tight uppercase"
                  >
                    <span
                      className={cn(
                        "flex h-8 w-28 items-center justify-center rounded px-2 text-center text-[9px] text-white shadow-xs",
                        areaColors[a.id] || "bg-primary",
                      )}
                      title={a.name.replace("Kabupaten ", "")}
                    >
                      <span className="truncate">
                        {a.name.replace("Kabupaten ", "")}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "flex h-8 w-11 items-center justify-center rounded text-[10px] font-black text-white tabular-nums shadow-xs",
                        areaColors[a.id] || "bg-primary",
                      )}
                    >
                      {summary[a.id]}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function IsNotInViewSkeleton({ hasManyAreas }: { hasManyAreas: boolean }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 sm:flex-row">
      {/* Chart Skeleton Wrapper (Matching 300x200 chart container) */}
      <div
        className="flex items-center justify-center"
        style={{ width: 300, height: 200 }}
      >
        <Skeleton className="size-[200px] rounded-full" />
      </div>

      {/* Progress Grid Skeleton */}
      <div className="flex flex-1 justify-center gap-x-10">
        <div className="space-y-4">
          <Skeleton className="h-7 w-40 rounded" />
          <Skeleton className="h-7 w-40 rounded" />
          <Skeleton className="h-7 w-40 rounded" />
          <Skeleton className="h-7 w-40 rounded" />
        </div>
        {hasManyAreas && (
          <div className="space-y-4">
            <Skeleton className="h-7 w-40 rounded" />
            <Skeleton className="h-7 w-40 rounded" />
            <Skeleton className="h-7 w-40 rounded" />
          </div>
        )}
      </div>
    </div>
  );
}
