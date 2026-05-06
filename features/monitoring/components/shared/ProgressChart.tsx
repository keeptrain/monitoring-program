"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface SeriesConfig {
  key: string;
  label: string;
  color: string;
  dash: string;
  dotRadius: number;
}

interface ProgressChartProps {
  isVisible: boolean;
  data: {
    chartData: any[];
  };
  config: {
    seriesConfig: SeriesConfig[];
  };
}

export default function ProgressChart({
  isVisible,
  data,
  config,
}: ProgressChartProps) {
  const { chartData } = data;
  const { seriesConfig } = config;

  return (
    <div className="h-[300px] w-full">
      {!isVisible ? (
        <LoadingChart />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eee"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#999", fontSize: 11, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#999", fontSize: 11, fontWeight: 600 }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={48}
              iconType="plainline"
              formatter={(value: string) => {
                const config = seriesConfig.find((s) => s.key === value);
                return (
                  <label className="text-muted-foreground text-xs font-semibold tracking-tight uppercase">
                    {config?.label || value}
                  </label>
                );
              }}
            />
            {seriesConfig.map((series) => (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                stroke={series.color}
                strokeDasharray={series.dash}
                strokeWidth={1}
                dot={{
                  r: series.dotRadius,
                  fill: "#ffffff",
                  strokeWidth: 1,
                  stroke: series.color,
                }}
                activeDot={{ r: series.dotRadius + 2 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function LoadingChart() {
  return (
    <div className="flex h-full w-full flex-col space-y-6">
      <div className="flex flex-1 items-end justify-between space-x-6 px-4 pb-4">
        {[100, 40, 75, 50, 90, 60, 85].map((h, i) => (
          <Skeleton
            key={i}
            className="w-full"
            style={{ height: `${h}%`, opacity: 0.2 + i * 0.1 }}
          />
        ))}
      </div>
      <div className="flex justify-center space-x-8 px-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-4 w-20" />
        ))}
      </div>
    </div>
  );
}
