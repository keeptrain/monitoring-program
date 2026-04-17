"use client";

import { TractorIcon, UsersIcon } from "lucide-react";
import { PieChart, Pie, ResponsiveContainer, Label } from "recharts";

export default function IsfPublicMonitoringDetail({
  data,
}: {
  data: { name: string };
}) {
  return (
    <div className="mx-4 space-y-8">
      {/* Last Updated Status */}
      <LastUpdateStatus />

      <div className="flex w-full items-center gap-12">
        <div className="size-56 shrink-0">
          <ZoneProgressChart progress={85} />
        </div>

        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <p className="text-muted-foreground font-bold tracking-widest uppercase">
              Tenaga Kerja
            </p>
            <div className="flex items-center gap-3">
              <UsersIcon className="size-6" />
              <p className="text-3xl font-bold">
                45 <span className="text-sm">Orang</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foregroundfont-bold tracking-widest uppercase">
              Alat Berat
            </p>
            <div className="flex items-center gap-3">
              <TractorIcon className="size-6" />
              <p className="text-3xl font-bold">
                12 <span className="text-sm">Unit</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <p className="text-muted-foreground tracking-widest uppercase">
          Ringkasan Aktivitas
        </p>
        <p className="text-foreground/80 text-sm leading-relaxed">
          Tahapan ini mencakup implementasi {data.name} pada kawasan Integrated
          Shrimp Farming. Seluruh infrastruktur telah terpasang dan beroperasi
          sesuai standar operasional yang ditetapkan.
        </p>
      </div>
    </div>
  );
}

function LastUpdateStatus() {
  return (
    <div className="flex flex-col items-start gap-4 border-y border-dashed py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col items-start gap-3 text-base">
        <div className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
        </div>
        <p>Data Terakhir Diperbarui</p>
      </div>
      <div className="flex flex-col items-end text-lg">
        <p className="text-foreground uppercase">17 April 2024</p>
        <p className="text-muted-foreground uppercase">15:45 WIB</p>
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
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          innerRadius={75}
          outerRadius={95}
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
                  <tspan x={cx} y={cy} className="fill-primary text-4xl">
                    {progress}%
                  </tspan>
                </text>
              );
            }}
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
