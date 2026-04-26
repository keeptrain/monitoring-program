"use client";

import { ProgressPieChartZoneIsf } from "../components/isf-detail/ProgressPieChartZoneIsf";
import DocumentationCarouselGallery from "@/components/shared/DocumentationCarouselGallery";

export default function BioflocDetailPage({ data }: { data: any }) {
  const { data: bioflocData } = data;
  return (
    <div className="animate-in fade-in space-y-12 duration-700">
      {/* 2. Top Content: Stats Grid & Chart */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left Side: Stats Grid */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:gap-6">
          <StatsBox
            title="Komoditas Bantuan"
            value={bioflocData.commodity_aid}
          />
          <StatsBox
            title="Komoditas Potensi"
            value={bioflocData.commodity_potential || "-"}
          />
          <StatsBox
            title="Jumlah Pengurus"
            value={bioflocData.total_management}
          />
          <StatsBox title="Jumlah Anggota" value={bioflocData.total_members} />
          <StatsBox
            title="Volume Produksi"
            value={bioflocData.production_value}
          />
          <StatsBox
            title="Nilai Produksi"
            value={bioflocData.distribution_amount}
          />
        </div>

        {/* Right Side: Progress Chart Section */}
        <div className="flex flex-col items-center justify-center border border-zinc-100 bg-zinc-50/50 p-8 shadow-xs">
          <p className="mb-6 text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">
            Grafik Progress
          </p>
          <div className="relative size-48">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-44 rounded-full border border-zinc-100 bg-white" />
            </div>
            <ProgressPieChartZoneIsf progress={bioflocData.progress_percent} />
          </div>
        </div>
      </div>

      {/* 3. Bottom Content: Cycle Data & Documentation */}
      {/* Soon is getting data from API */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Data Siklus (Styled like ISF Tables) */}
        <div className="self-start overflow-hidden border border-zinc-100 bg-white shadow-xs">
          <div className="bg-primary px-6 py-3">
            <p className="text-xs font-bold tracking-widest text-white uppercase">
              Data Siklus I
            </p>
          </div>
          <div className="space-y-4 p-6">
            <CycleItem label="Padat Tebar" value={"-"} />
            <CycleItem label="Jumlah Tebar" value={"-"} />
            <CycleItem label="Jumlah Panen" value={"-"} />
          </div>
        </div>
      </div>
      <DocumentationCarouselGallery
        type="biofloc_thematic"
        id={bioflocData.id}
      />
    </div>
  );
}

function StatsBox({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="group flex flex-col items-start justify-center border border-zinc-100 bg-zinc-50/30 p-5 transition-all duration-300 hover:bg-white hover:shadow-sm">
      <p className="text-muted-foreground group-hover:text-primary mb-2 text-xs leading-tight transition-colors">
        {title}
      </p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function CycleItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-50 pb-3 last:border-0 last:pb-0">
      <span className="text-muted-foreground text-xs font-semibold uppercase">
        {label}
      </span>
      <span className="text-sm font-semibold uppercase">{value}</span>
    </div>
  );
}
