"use client";

import Link from "next/link";
import {
  PencilIcon,
  BriefcaseIcon,
  TrendingUpIcon,
  ConstructionIcon,
  GoalIcon,
  AlertTriangleIcon,
  RefreshCcwIcon,
  CameraIcon,
  FileTextIcon,
  DownloadIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IsfProgramLog } from "../types/isf";
import { cn, formatDate } from "@/lib/utils";
import { LinkBackButton } from "@/components/shared/LinkBackButton";
import { Progress } from "@/components/ui/progress";
import { useGetDocumentationGroupsByTypeAndId } from "@/features/documentation/api/getDocumentationGroupsByTypeAndId";
import { CarouselDApiDemo } from "@/components/shared/DocumentationCarouselGallery";
import { STEPS } from "../constants/isf-step";

export default function IsfProgramLogDetail({ data }: { data: IsfProgramLog }) {
  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-4 sm:pb-10">
      <Header data={data} />

      <div className="space-y-8">
        {/* Dates Info Section */}
        <TimelineInfo data={data} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            <Overview data={data} />
            <Narrative data={data} />
            <SCurveSection path={data.s_curve_path} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ProgressCard data={data} />
          </div>
        </div>

        {/* Full Width Documentation */}
        <DocumentationSection programId={data.id} />
      </div>
    </div>
  );
}

function Header({ data }: { data: IsfProgramLog }) {
  const { id, step_id, name } = data;
  const step = STEPS.find((s) => s.id === step_id);
  const stepName = `Zona ${step_id}${step ? `: ${step.name}` : ""}`;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
          Dashboard / ISF / Laporan / Detail
        </p>
        <div className="flex items-center gap-2">
          <LinkBackButton href={`/dashboard/isf/${step_id}`} />
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            {name}
          </h1>
        </div>
        <div className="text-muted-foreground mt-2 flex items-center gap-1.5 text-sm font-bold tracking-widest uppercase">
          {stepName}
        </div>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href={`/dashboard/isf/report/${id}/edit`}>
          <PencilIcon className="mr-1 size-4" /> Ubah Laporan
        </Link>
      </Button>
    </div>
  );
}

function TimelineInfo({ data }: { data: IsfProgramLog }) {
  const { progress_date, created_at, updated_at } = data;
  const dates = [
    { label: "Tanggal Laporan", value: progress_date },
    { label: "Dibuat Pada", value: created_at },
    { label: "Pembaruan Terakhir", value: updated_at },
  ];

  return (
    <div className="grid grid-cols-1 gap-px border border-zinc-100 bg-zinc-100 sm:grid-cols-3">
      {dates.map((item) => (
        <div key={item.label} className="bg-white p-4">
          <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
            {item.label}
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">
            {formatDate(item.value)}
          </p>
        </div>
      ))}
    </div>
  );
}

function Overview({ data }: { data: IsfProgramLog }) {
  const { provider_name, production } = data;
  return (
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
  );
}

function Narrative({ data }: { data: IsfProgramLog }) {
  const { outcome, constraints, follow_up, intervention } = data;
  const items = [
    {
      label: "Outcome",
      value: outcome,
      icon: GoalIcon,
      colorClass: "text-indigo-500",
    },
    {
      label: "Kendala",
      value: constraints || "-",
      icon: AlertTriangleIcon,
      colorClass: "text-amber-500",
    },
    {
      label: "Tindak Lanjut",
      value: follow_up || "-",
      icon: RefreshCcwIcon,
      colorClass: "text-rose-500",
    },
  ];

  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="border border-zinc-100 bg-zinc-50/30 p-5 transition-all hover:bg-zinc-50/60"
          >
            <div className="mb-3 flex items-center gap-2">
              <item.icon className={cn("size-4", item.colorClass)} />
              <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                {item.label}
              </p>
            </div>
            <p className="text-sm leading-relaxed font-medium text-zinc-600">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SCurveSection({ path }: { path: string | null }) {
  const fileName = path?.split("/").pop() || "Tidak ada file";

  return (
    <div className="space-y-4 border-zinc-100">
      <div className="flex flex-col border border-zinc-100 bg-zinc-50/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
            Kurva S
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-lg",
                path
                  ? "bg-primary/10 text-primary"
                  : "bg-zinc-100 text-zinc-400",
              )}
            >
              <FileTextIcon className="size-4" />
            </div>
            <div>
              <p
                className={cn(
                  "max-w-[200px] truncate text-sm font-medium sm:max-w-md",
                  path ? "text-zinc-900" : "text-zinc-400",
                )}
              >
                {fileName}
              </p>
              <p className="text-[10px] font-medium text-zinc-400">Dokumen</p>
            </div>
          </div>
          {path && (
            <Button variant="outline" size="sm" asChild className="bg-white">
              <a
                href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/demo/${path}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DownloadIcon className="mr-2 size-3.5" /> Unduh
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function DocumentationSection({ programId }: { programId: number }) {
  const { data: groups, isPending } = useGetDocumentationGroupsByTypeAndId(
    "isf",
    programId,
    true, // always fetch for detail page
  );

  return (
    <div className="space-y-6 border-t border-zinc-100 pt-8">
      <div className="flex items-center gap-2">
        <CameraIcon className="size-5 text-zinc-400" />
        <p className="text-sm font-semibold tracking-widest uppercase">
          Dokumentasi Pengerjaan
        </p>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="aspect-4/3 animate-pulse rounded-lg bg-zinc-100" />
          <div className="aspect-4/3 animate-pulse rounded-lg bg-zinc-100" />
        </div>
      ) : !groups || groups.length === 0 ? (
        <div className="flex h-32 items-center justify-center border border-dashed border-zinc-200 bg-zinc-50 text-center">
          <p className="text-muted-foreground text-xs">
            Belum ada dokumentasi yang diunggah
          </p>
        </div>
      ) : (
        groups.map((group, index) => (
          <div key={group.groupId || index} className="space-y-4">
            {groups.length > 1 && (
              <p className="text-end text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Grup Dokumentasi {index + 1}
              </p>
            )}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <section className="space-y-2">
                <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                  Sebelum
                </p>
                <CarouselDApiDemo
                  images={group.beforeUrls.map((url) => ({ src: url }))}
                  emptyLabel="Sebelum"
                />
              </section>
              <section className="space-y-2">
                <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                  Sesudah
                </p>
                <CarouselDApiDemo
                  images={group.afterUrls.map((url) => ({ src: url }))}
                  emptyLabel="Sesudah"
                />
              </section>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ProgressCard({ data }: { data: IsfProgramLog }) {
  const { progress_percent, status, total_worker } = data;
  return (
    <Card className="border-border shadow-none">
      <CardContent className="space-y-6 p-6">
        <div>
          <div className="mb-3 flex items-end justify-between">
            <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Akumulasi Capaian
            </p>
            <p className="text-primary text-3xl leading-none font-black tracking-tighter italic">
              {progress_percent}%
            </p>
          </div>
          <Progress value={progress_percent} className="h-2" />
        </div>

        <div className="flex flex-col gap-4 border-zinc-100">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Status
            </p>
            <span className="bg-primary mt-1 inline-flex px-2 py-0.5 text-[10px] font-semibold text-white">
              {status}
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Tenaga Kerja
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">
              {total_worker}{" "}
              <span className="text-xs font-medium text-zinc-500">Orang</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
