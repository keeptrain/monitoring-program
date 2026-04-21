"use client";

import { useState, useMemo } from "react";
import { HardHatIcon, ArrowLeftIcon } from "lucide-react";
import { PieChart, Pie, Cell, Label } from "recharts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const pieData = [
  { name: "Luar Sumba Timur", value: 48, fill: "#f97316" }, // Orange
  { name: "Lokal Sumba Timur", value: 1260, fill: "#0ea5e9" }, // Light Blue
];

const PUBLIC_IMAGES = [
  "/images/bioflok.jpeg",
  "/images/isf_map.webp",
  "/images/revitalisasi-tambak-pantura.jpg",
  "/images/tambak-udang.jpg",
];

export default function RecruitmentProgressPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-0">
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

      {/* Layout Utama */}
      <div className="mt-12 space-y-16">
        {/* Row 1: Kebutuhan & Pelatihan Side-by-Side */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Kolom: Kebutuhan Tenaga Kerja */}
          <div className="flex flex-col gap-8 lg:col-span-5">
            <div className="relative mt-8">
              <div className="absolute -top-8 left-1/2 flex size-12 -translate-x-1/2 items-center justify-center rounded-full border-2 border-amber-400 bg-white shadow-sm">
                <HardHatIcon className="size-6 text-amber-500" />
              </div>
              <div className="rounded-full bg-amber-400 p-4 pt-6 text-center text-zinc-900 shadow-sm">
                <p className="text-[10px] font-bold tracking-tight uppercase opacity-80">
                  Total Kebutuhan
                </p>
                <p className="text-xl leading-none font-bold">5.424 Orang</p>
              </div>
              <div className="mx-auto h-0 w-0 border-x-12 border-t-15 border-x-transparent border-t-amber-400"></div>
            </div>

            {/* List Detail */}
            <div className="mx-auto w-full text-xs text-zinc-800">
              <ul className="space-y-1.5 divide-y divide-zinc-100">
                <li className="flex justify-between py-1">
                  <span>Konstruksi</span>
                  <span className="font-bold">1.889 Orang</span>
                </li>
                <li className="flex justify-between py-1">
                  <span>Hulu</span>
                  <span className="font-bold">386 Orang</span>
                </li>
                <li className="flex justify-between py-1">
                  <span>Onfarm</span>
                  <span className="font-bold">1.911 Orang</span>
                </li>
                <li className="flex justify-between py-1">
                  <span>Hilir</span>
                  <span className="font-bold">1.167 Orang</span>
                </li>
                <li className="flex justify-between py-1">
                  <span>Pendukung</span>
                  <span className="font-bold">71 Orang</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Kolom: Pie Chart Progres Pelatihan */}
          <div className="flex flex-col gap-8 lg:col-span-7">
            <div className="space-y-6 p-6">
              <div className="rounded-full bg-amber-400 px-4 py-2 text-center text-zinc-900 shadow-sm">
                <p className="text-sm font-bold tracking-tight uppercase">
                  Progres Pelatihan Tenaga Kerja Onfarm
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                {/* Luar Sumba Timur */}
                <div className="text-center sm:text-right">
                  <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                    Luar Sumba Timur
                  </p>
                  <p className="text-2xl font-black text-orange-500">
                    48 <span className="text-xs font-bold">Orang</span>
                  </p>
                </div>

                {/* Pie Chart */}
                <div className="relative shrink-0">
                  <PieChart width={200} height={200}>
                    <Pie
                      data={pieData}
                      innerRadius={65}
                      outerRadius={85}
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
                                y={cy - 5}
                                className="fill-zinc-900 text-2xl font-black"
                              >
                                1.308
                              </tspan>
                              <tspan
                                x={cx}
                                y={cy + 15}
                                className="fill-zinc-400 text-[10px] font-bold"
                              >
                                TOTAL
                              </tspan>
                            </text>
                          );
                        }}
                      />
                    </Pie>
                  </PieChart>
                </div>

                {/* Lokal Sumba Timur */}
                <div className="text-center sm:text-left">
                  <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                    Lokal Sumba Timur
                  </p>
                  <p className="text-2xl font-black text-sky-500">
                    1.260 <span className="text-xs font-bold">Orang</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Interactive Timeline & Gallery Section */}
        <RecruitmentTimelineSection />
      </div>
    </div>
  );
}

function RecruitmentTimelineSection() {
  const [activeStep, setActiveStep] = useState(1);

  // Definisi Step dalam Object
  const timelineSteps = useMemo(
    () => [
      {
        id: 1,
        date: "6 - 7 Feb 2026",
        title: "Sosialisasi Rekrutmen Tenaga Kerja di Sumba Timur",
        isClickable: true,
      },
      {
        id: 2,
        date: "10 Feb - 25 Mei 2026",
        title: "Proses rekrutmen (pendaftaran dan seleksi)",
        isClickable: true,
      },
      {
        id: 3,
        date: "1 Juni - Des 2026",
        title: "Masa pendidikan dan magang",
        details: [
          "Pembentukan karakter komcad & pelatihan manajerial",
          "Masa pendidikan dan magang operator",
        ],
        isClickable: true,
      },
      {
        id: 4,
        date: "Jan 2027",
        title: "Tenaga kerja siap ditempatkan",
        isClickable: true,
      },
      {
        id: 5,
        date: "TW 4 2027",
        title: "Target Penyelesaian",
        isItalic: true,
        opacity: "opacity-60",
        isClickable: false,
      },
    ],
    [],
  );

  // Logika Randomize Gambar per Step
  const galleryImages = useMemo(() => {
    // Gunakan seed sederhana berdasarkan activeStep agar "random" tapi konsisten per klik
    return [...PUBLIC_IMAGES].sort((a, b) => {
      const hashA = a.length + activeStep;
      const hashB = b.length + activeStep;
      return (hashA % 3) - (hashB % 2);
    });
  }, [activeStep]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Kolom Timeline */}
      <div className="lg:col-span-4">
        <div className="rounded-2xl border-4 border-sky-400 bg-linear-to-b from-sky-700 to-[#0f3254] px-8 py-6 text-white shadow-lg">
          <h2 className="mb-10 text-center text-xl leading-tight font-bold">
            Timeline Rekrutmen <br /> Tenaga Kerja
          </h2>

          <div className="pl-6">
            <div className="relative space-y-10 border-l border-white/20">
              {timelineSteps.map((step) => {
                const isActive = activeStep === step.id;

                if (!step.isClickable) {
                  return (
                    <div
                      key={step.id}
                      className={cn("relative pl-8", step.opacity)}
                    >
                      <div className="absolute top-1 -left-[11px] size-5 items-center justify-center rounded-full border-4 border-sky-500 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                      <div className="w-fit rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold text-zinc-900 uppercase">
                        {step.date}
                      </div>
                      <p
                        className={cn(
                          "mt-2 text-sm font-medium",
                          step.isItalic && "text-zinc-300 italic",
                        )}
                      >
                        {step.title}
                      </p>
                    </div>
                  );
                }

                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={cn(
                      "relative block w-full pl-8 text-left transition-all duration-300",
                      isActive
                        ? "scale-105 opacity-100"
                        : "opacity-60 grayscale hover:opacity-100 hover:grayscale-0",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1 -left-[11px] size-5 items-center justify-center rounded-full border-4 border-sky-500 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]",
                        isActive && "ring-4 ring-amber-400/30",
                      )}
                    />
                    <div className="mb-2 w-fit rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold text-zinc-900 uppercase">
                      {step.date}
                    </div>
                    <p className="text-sm font-medium">{step.title}</p>
                    {step.details && (
                      <ul className="mt-2 list-disc space-y-1 text-[10px] leading-relaxed text-zinc-100 opacity-80">
                        {step.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Gallery (2x2 Grid) */}
      <div className="lg:col-span-8">
        <div className="flex h-full flex-col gap-6">
          <h3 className="flex items-center text-base font-semibold">
            Dokumentasi
          </h3>

          <div className="grid h-full grid-cols-2 gap-4">
            {galleryImages.map((src, idx) => (
              <div
                key={`${activeStep}-${idx}`}
                className="group animate-in fade-in zoom-in-95 relative aspect-video overflow-hidden bg-zinc-200 shadow-sm transition-all duration-500"
              >
                <img
                  src={src}
                  alt={`Dokumentasi ${activeStep}-${idx}`}
                  className="object-crop h-full w-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
