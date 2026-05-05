"use client";

import { PieChart, Pie, Label } from "recharts";

export function ProgressPieChartZoneIsf({
  progress,
  size = 176,
}: {
  progress: number;
  size?: number;
}) {
  const chartData = [
    { name: "Progress", value: progress, fill: "var(--primary)" },
    { name: "Sisa", value: 100 - progress, fill: "#f1f5f9" },
  ];

  const innerRadius = Math.round(size * 0.37);
  const outerRadius = Math.round(size * 0.48);

  return (
    <PieChart width={size} height={size}>
      <Pie
        data={chartData}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={90}
        endAngle={450}
        dataKey="value"
        stroke="none"
        isAnimationActive={true}
        animationDuration={800}
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
                  y={cy}
                  className="fill-primary text-3xl font-black tracking-tighter italic"
                >
                  {progress}%
                </tspan>
              </text>
            );
          }}
        />
      </Pie>
    </PieChart>
  );
}
