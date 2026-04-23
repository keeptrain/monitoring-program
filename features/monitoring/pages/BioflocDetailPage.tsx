"use client";

import { CameraIcon, MapPin } from "lucide-react";
import { ProgressPieChartZoneIsf } from "../components/isf-detail/ProgressPieChartZoneIsf";

export default function BioflocDetailPage({ data }: { data: any }) {
  // Dummy data
  const dummyData = {
    kdmp_name: "POKDAKAN MINA JAYA",
    address:
      "Kelurahan Sukamaju, Desa Maju Terus, Kabupaten Sumba Timur, Provinsi NTT",
    komoditas_bantuan: "Ikan Nila",
    komoditas_potensi: "Ikan Lele",
    jumlah_pengurus: 5,
    jumlah_anggota: 15,
    volume_produksi: "1.200 Kg",
    nilai_produksi: "Rp 36.000.000",
    progress: 85,
    siklus: {
      padat_tebar: "100 ekor/m3",
      jumlah_tebar: "10.000 ekor",
      jumlah_panen: "8.500 ekor",
    },
  };

  return (
    <div className="animate-in fade-in space-y-12 duration-700">
      {/* 1. Header Section - Clean & Minimalist */}
      <div className="border-primary border-l-4 py-2 pl-6">
        <h1 className="text-xl font-semibold">{dummyData.kdmp_name}</h1>
        <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm font-medium">
          <MapPin className="size-4" />
          <p>{dummyData.address}</p>
        </div>
      </div>

      {/* 2. Top Content: Stats Grid & Chart */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left Side: Stats Grid */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:gap-6">
          <StatsBox
            title="Komoditas Bantuan"
            value={dummyData.komoditas_bantuan}
          />
          <StatsBox
            title="Komoditas Potensi"
            value={dummyData.komoditas_potensi}
          />
          <StatsBox title="Jumlah Pengurus" value={dummyData.jumlah_pengurus} />
          <StatsBox title="Jumlah Anggota" value={dummyData.jumlah_anggota} />
          <StatsBox title="Volume Produksi" value={dummyData.volume_produksi} />
          <StatsBox title="Nilai Produksi" value={dummyData.nilai_produksi} />
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
            <ProgressPieChartZoneIsf progress={dummyData.progress} />
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
            <CycleItem
              label="Padat Tebar"
              value={dummyData.siklus.padat_tebar}
            />
            <CycleItem
              label="Jumlah Tebar"
              value={dummyData.siklus.jumlah_tebar}
            />
            <CycleItem
              label="Jumlah Panen"
              value={dummyData.siklus.jumlah_panen}
            />
          </div>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="mb-2 flex items-center gap-2">
          <CameraIcon className="size-4" />
          <p className="text-base font-semibold text-zinc-400">Dokumentasi</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <DocumentationBox label="Foto Sebelum" />
          <DocumentationBox label="Foto Sesudah" />
        </div>
      </div>
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

function DocumentationBox({ label }: { label: string }) {
  return (
    <div className="group relative flex aspect-video flex-col items-center justify-center overflow-hidden border-2 border-dashed border-zinc-100 bg-zinc-50/50 transition-all hover:bg-zinc-100/50">
      <div className="absolute inset-0 bg-linear-to-t from-zinc-900/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <span className="relative z-10 text-[10px] font-black tracking-widest text-zinc-400 uppercase italic">
        {label}
      </span>
    </div>
  );
}
