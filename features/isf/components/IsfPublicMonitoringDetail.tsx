"use client";

import { Progress } from "@/components/ui/progress";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  CheckCircle2,
} from "lucide-react";

export default function IsfPublicMonitoringDetail({
  data,
}: {
  data: { name: string };
}) {
  // Mock data for the public view
  const mockStats = [
    { label: "Tanggal Mulai", value: "12 Jan 2024", icon: CalendarIcon },
    { label: "Lokasi", value: "Kawasan ISF Kebumen", icon: MapPinIcon },
    { label: "Tenaga Kerja", value: "45 Orang", icon: UsersIcon },
    { label: "Status", value: "Selesai", icon: CheckCircle2 },
  ];

  return (
    <div className="mx-4 space-y-8">
      {/* Progress Section */}
      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
            Progres Pengerjaan
          </p>
          <span className="text-primary text-2xl font-black italic">100%</span>
        </div>
        <Progress value={100} className="h-2" />
      </div>

      {/* Grid Info */}
      <div className="grid grid-cols-2 gap-4">
        {mockStats.map((stat, i) => (
          <div key={i} className="border-border bg-muted/20 border p-3">
            <div className="mb-1.5 flex items-center gap-2">
              <stat.icon className="text-muted-foreground size-3" />
              <p className="text-muted-foreground text-[9px] font-bold tracking-tighter uppercase">
                {stat.label}
              </p>
            </div>
            <p className="text-xs font-black tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
          Ringkasan Aktivitas
        </p>
        <p className="text-foreground/80 text-sm leading-relaxed">
          Tahapan ini mencakup implementasi {data.name} pada kawasan Integrated
          Shrimp Farming. Seluruh infrastruktur telah terpasang dan beroperasi
          sesuai standar operasional yang ditetapkan.
        </p>
      </div>

      {/* Documentation Placeholder */}
      <div className="space-y-4 border-t border-dashed pt-4">
        <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
          Dokumentasi Terakhir
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-muted border-border group relative aspect-square overflow-hidden border"
            >
              <div className="absolute inset-0 bg-slate-900/10 transition-colors group-hover:bg-transparent" />
              <div className="text-muted-foreground flex h-full w-full items-center justify-center text-[10px] font-bold uppercase">
                Foto Lapangan
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
