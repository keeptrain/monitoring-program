"use client";

import {
  ChevronDownIcon,
  HardHatIcon,
  DropletsIcon,
  WrenchIcon,
  BoxIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { PieChart, Pie, Cell, Label } from "recharts";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RecruitmentProgressPage() {
  const pieData = [
    { name: "Luar Sumba Timur", value: 48, fill: "#f97316" }, // Orange
    { name: "Lokal Sumba Timur", value: 1260, fill: "#0ea5e9" }, // Light Blue
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-10">
      <div className="space-y-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/monitoring">
            <ArrowLeftIcon className="size-4" />
            Kembali
          </Link>
        </Button>
        {/* Bagian Header */}
        <h1 className="text-primary text-xl font-bold">
          Progres Perekrutan Tenaga Kerja
        </h1>
      </div>

      {/* Layout Utama (3 Kolom seperti gambar) */}
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Kolom Kiri: Kebutuhan & Pie Chart (Lebih Lebar) */}
        <div className="flex flex-col gap-8 lg:col-span-6">
          {/* Box Kebutuhan */}
          <div className="relative mt-8">
            <div className="absolute -top-10 left-1/2 flex size-16 -translate-x-1/2 items-center justify-center rounded-full border-2 border-amber-400 bg-white shadow-sm">
              <HardHatIcon className="size-8 text-amber-500" />
            </div>
            <div className="rounded-full bg-amber-400 p-6 pt-8 text-center text-zinc-900 shadow-sm">
              <p className="text-sm">
                Kebutuhan Tenaga Kerja Konstruksi, Hulu, Onfarm dan Hilir
              </p>
              <p className="text-2xl font-bold">5.424 Orang</p>
            </div>
            {/* Segitiga Bawah Pemanis (Opsional seperti di ilustrasi) */}
            <div className="mx-auto h-0 w-0 border-x-15 border-t-20 border-x-transparent border-t-amber-400"></div>
          </div>

          {/* List Detail */}
          <div className="pl-6 text-sm text-zinc-800 lg:pl-10">
            <ul className="list-disc space-y-1">
              <li>
                Kebutuhan Tenaga Kerja Konstruksi : <strong>1889 Orang</strong>
              </li>
              <li>
                Kebutuhan Tenaga Kerja Hulu : <strong>386 Orang</strong>
              </li>
              <li>
                Kebutuhan Tenaga Kerja Onfarm : <strong>1.911 Orang</strong>
              </li>
              <li>
                Kebutuhan Tenaga Kerja Hilir : <strong>1.167 Orang</strong>
              </li>
              <li>
                Kebutuhan Tenaga Kerja Kawasan Pendukung :{" "}
                <strong>71 Orang</strong>
              </li>
            </ul>
          </div>

          {/* Box Pelatihan Onfarm */}
          <div className="mt-2 rounded-full bg-amber-400 px-4 py-3 text-center text-zinc-900 shadow-sm">
            <p className="text-base font-bold sm:text-lg">
              Pelatihan Budi Daya Udang untuk Tenaga Kerja Onfarm
            </p>
          </div>

          <div className="mt-4 flex flex-col items-center justify-center gap-6 sm:flex-row">
            {/* Label Kiri */}
            <div className="text-center sm:text-right">
              <p className="text-sm">Tenaga Kerja</p>
              <p className="text-sm font-bold">Luar Sumba Timur</p>
              <p className="text-xl font-bold text-orange-500">48 Orang</p>
            </div>

            {/* Pie Chart */}
            <div className="relative shrink-0">
              <PieChart width={220} height={220}>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={95}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      const { cx, cy } = viewBox as {
                        cx: number;
                        cy: number;
                      };
                      return (
                        <text
                          x={cx}
                          y={cy}
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          <tspan
                            x={cx}
                            y={cy - 10}
                            className="fill-zinc-900 text-3xl font-bold"
                          >
                            1.308
                          </tspan>
                          <tspan
                            x={cx}
                            y={cy + 15}
                            className="fill-zinc-900 text-sm"
                          >
                            Orang
                          </tspan>
                        </text>
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </div>

            {/* Label Kanan */}
            <div className="text-center sm:text-left">
              <p className="text-sm">Tenaga Kerja</p>
              <p className="text-sm font-bold">Lokal Sumba Timur</p>
              <p className="text-xl font-bold text-sky-500">1.260 Orang</p>
            </div>
          </div>
        </div>

        {/* Kolom Tengah: Rincian Pelatihan */}
        <div className="lg:col-span-3">
          <div className="h-full rounded-2xl border-4 border-sky-400 bg-[#0f4b7a] p-6 text-white shadow-md">
            <div className="mx-auto mb-6 w-fit rounded-full bg-amber-400 px-6 py-1.5 text-center text-sm font-bold text-zinc-900">
              Rincian Pelatihan Tenaga Kerja
            </div>
            <p className="mb-8 text-sm">
              Pembentukan karakter melalui pembentukan komponen Cadangan
              (Komcad)
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="shrink-0 rounded bg-orange-400 p-2">
                  <WrenchIcon className="size-6 text-white" />
                </div>
                <p className="text-sm">Pelatihan asisten mesin dan listrik</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="shrink-0 rounded bg-sky-400 p-2">
                  <DropletsIcon className="size-6 text-white" />
                </div>
                <p className="text-sm">Pelatihan operator/anak kolam</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="shrink-0 rounded bg-orange-600 p-2">
                  <BoxIcon className="size-6 text-white" />
                </div>
                <p className="text-sm">
                  Pelatihan singkat tenaga panen parsial
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Timeline Perekrutan */}
        <div className="lg:col-span-3">
          <div className="h-full rounded-2xl border-4 border-sky-400 bg-linear-to-b from-sky-700 to-[#0f3254] p-6 text-white shadow-md">
            <h2 className="mx-auto mb-8 max-w-[200px] text-center text-lg leading-tight font-bold">
              Timeline Rekrutmen Tenaga Kerja
            </h2>

            <div className="pl-6">
              <div className="relative space-y-8">
                {/* Timeline 1 */}
                <div className="relative">
                  <div className="absolute top-1 -left-[35px] flex size-5 items-center justify-center rounded-full border-4 border-sky-500 bg-amber-400"></div>
                  <ChevronDownIcon className="absolute top-7 -left-[30px] size-7 text-amber-200/50" />
                  <div className="mb-2 w-fit rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-zinc-900">
                    6-7 Feb 2026
                  </div>
                  <p className="text-sm">
                    Sosialisasi Rekrutmen Tenaga Kerja di Sumba Timur
                  </p>
                </div>

                {/* Timeline 2 */}
                <div className="relative">
                  <div className="absolute top-1 -left-[35px] flex size-5 items-center justify-center rounded-full border-4 border-sky-500 bg-amber-400"></div>
                  <ChevronDownIcon className="absolute top-7 -left-[30px] size-7 text-amber-200/50" />
                  <div className="mb-2 w-fit rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-zinc-900">
                    10 Feb – 25 Mei 2026
                  </div>
                  <p className="text-sm">
                    Proses rekrutmen (pendaftaran dan seleksi)
                  </p>
                </div>

                {/* Timeline 3 */}
                <div className="relative">
                  <div className="absolute top-1 -left-[35px] flex size-5 items-center justify-center rounded-full border-4 border-sky-500 bg-amber-400"></div>
                  <ChevronDownIcon className="absolute top-[70px] -left-[30px] size-7 text-amber-200/50" />
                  <ChevronDownIcon className="absolute top-[95px] -left-[30px] size-7 text-amber-200/50" />
                  <div className="mb-2 w-fit rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-zinc-900">
                    1 Juni – Des 2026
                  </div>
                  <ul className="ml-4 list-[circle] space-y-2 text-sm leading-snug">
                    <li>
                      Pembentukan karakter komcad dan pelatihan manajerial
                    </li>
                    <li>
                      Masa pendidikan dan magang operator anak kolam dan asisten
                      mesin & listrik
                    </li>
                  </ul>
                </div>

                {/* Timeline 4 */}
                <div className="relative">
                  <div className="absolute top-1 -left-[35px] flex size-5 items-center justify-center rounded-full border-4 border-sky-500 bg-amber-400"></div>
                  <ChevronDownIcon className="absolute top-7 -left-[30px] size-7 text-amber-200/50" />
                  <div className="mb-2 w-fit rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-zinc-900">
                    Jan 2027
                  </div>
                  <p className="text-sm">
                    operator anak kolam dan asisten mesin & listrik siap
                    ditempatkan
                  </p>
                </div>

                {/* Timeline 5 */}
                <div className="relative">
                  <div className="absolute top-1 -left-[35px] flex size-5 items-center justify-center rounded-full border-4 border-sky-500 bg-amber-400"></div>
                  <div className="w-fit rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-zinc-900">
                    TW 4 2027
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
