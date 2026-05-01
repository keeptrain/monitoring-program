"use client";

import {
  BriefcaseIcon,
  TrendingUpIcon,
  ConstructionIcon,
  GoalIcon,
  AlertTriangleIcon,
  RefreshCcwIcon,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function WeekDetailInfo({ data }: { data: any }) {
  const {
    provider_name,
    production,
    intervention,
    outcome,
    constraints,
    follow_up,
  } = data;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="group relative flex items-center gap-4 border border-zinc-100 bg-white p-4 transition-all hover:bg-zinc-50/50">
          <div className="flex size-10 items-center justify-center bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
            <BriefcaseIcon className="size-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Penyedia
            </p>
            <p className="leading-tight font-semibold text-zinc-900">
              {provider_name}
            </p>
          </div>
        </div>

        <div className="group relative flex items-center gap-4 border border-zinc-100 bg-white p-4 transition-all hover:bg-zinc-50/50">
          <div className="flex size-10 items-center justify-center bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
            <TrendingUpIcon className="size-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Produksi
            </p>
            <p className="leading-tight font-semibold text-zinc-900">
              {production}
            </p>
          </div>
        </div>
      </div>

      {/* Main Information */}
      <div className="space-y-4">
        {/* Kegiatan / Intervensi */}
        <div className="relative overflow-hidden border border-zinc-100 bg-white p-5 transition-all hover:border-zinc-200">
          <div className="bg-primary absolute top-0 left-0 h-full w-1"></div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-6 items-center justify-center bg-zinc-100 text-zinc-500">
              <ConstructionIcon className="size-3.5" />
            </div>
            <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Kegiatan / Intervensi
            </p>
          </div>
          <p className="leading-relaxed font-medium text-zinc-700">
            {intervention}
          </p>
        </div>

        {/* Status Group */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="border border-zinc-100 bg-zinc-50/30 p-5 transition-all hover:bg-zinc-50/60">
            <div className="mb-3 flex items-center gap-2">
              <GoalIcon className="size-4 text-indigo-500" />
              <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                Outcome
              </p>
            </div>
            <p className="leading-relaxed font-medium text-zinc-600">
              {outcome}
            </p>
          </div>

          <div className="border border-zinc-100 bg-zinc-50/30 p-5 transition-all hover:bg-zinc-50/60">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangleIcon className="size-4 text-amber-500" />
              <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                Kendala
              </p>
            </div>
            <p className="leading-relaxed font-medium text-zinc-600">
              {constraints}
            </p>
          </div>

          <div className="border border-zinc-100 bg-zinc-50/30 p-5 transition-all hover:bg-zinc-50/60">
            <div className="mb-3 flex items-center gap-2">
              <RefreshCcwIcon className="size-4 text-rose-500" />
              <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                Tindak Lanjut
              </p>
            </div>
            <p className="leading-relaxed font-medium text-zinc-600">
              {follow_up}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
