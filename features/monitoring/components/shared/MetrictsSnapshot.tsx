import { TractorIcon, UsersIcon } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

export default function MetrictsSnapshot({
  progressPercent,
}: {
  progressPercent: number;
}) {
  return (
    <div className="flex w-full items-center gap-12">
      <div className="size-[140px] shrink-0">
        <ZoneProgressChart progress={progressPercent} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-3">
          <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Tenaga Kerja
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <UsersIcon className="size-6" />
              <p className="text-xl font-bold">
                {12} <span className="text-sm">Orang</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Alat Berat
          </p>
          <div className="flex items-center gap-3">
            <TractorIcon className="size-6" />
            <p className="text-xl font-bold">
              12 <span className="text-sm">Unit</span>
            </p>
          </div>
        </div>
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
