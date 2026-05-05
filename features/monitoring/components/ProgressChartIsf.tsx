"use client";

import { useQuery } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
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
import { LINE_SERIES } from "../utils/monitoring-constants";
import { Skeleton } from "@/components/ui/skeleton";
import { getProgressChartIsf } from "../actions/chart-actions";

const getProgressChartIsfQueryKey = () => ["progress-chart", "isf"];

export default function ProgressChartIsf() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const { data: chartData, isLoading } = useQuery({
    queryKey: getProgressChartIsfQueryKey(),
    queryFn: async () => await getProgressChartIsf(),
    enabled: hasEnteredView,
  });

  return (
    <div
      ref={containerRef}
      className="flex w-full flex-col items-center justify-center space-y-8"
    >
      <p className="text-primary text-xs font-black tracking-[0.3em] uppercase">
        Grafik Progress
      </p>
      <div style={{ width: "100%", height: 300 }}>
        {!hasEnteredView || isLoading ? (
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
                formatter={(value: string) => (
                  <span className="text-foreground/70 text-[11px] font-bold tracking-tight uppercase">
                    Zona {value.replace("z", "")}
                  </span>
                )}
              />
              {LINE_SERIES.map((series) => (
                <Line
                  key={series.key}
                  type="monotone"
                  dataKey={series.key}
                  stroke={series.color}
                  strokeDasharray={series.dash}
                  strokeWidth={3}
                  dot={{
                    r: series.dotRadius,
                    fill: "#ffffff",
                    strokeWidth: 2,
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
