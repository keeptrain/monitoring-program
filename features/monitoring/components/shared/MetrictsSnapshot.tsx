import { UsersIcon } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

export default function MetrictsSnapshot({
  progressPercent,
  totalWorker,
  children,
}: {
  progressPercent: number;
  totalWorker: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-center sm:gap-12">
      <div className="size-[140px] shrink-0">
        <ZoneProgressChart progress={progressPercent} />
      </div>

      <div className="flex flex-wrap gap-8 sm:gap-6">
        <div className="flex flex-col gap-4">
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Tenaga Kerja
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <UsersIcon className="size-6 text-blue-500" />
                <p className="text-xl font-bold">
                  {totalWorker}{" "}
                  <span className="text-sm font-medium">Orang</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function ZoneProgressChart({ progress }: { progress: number }) {
  const data = [
    { name: "Progress", value: progress, fill: "#3b82f6" },
    { name: "Sisa", value: 100 - progress, fill: "#f1f5f9" },
  ];

  return (
    <PieChart width={140} height={140}>
      <Pie
        data={data}
        innerRadius={55}
        outerRadius={70}
        startAngle={90}
        endAngle={450}
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
                  className="fill-primary text-2xl font-bold"
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
