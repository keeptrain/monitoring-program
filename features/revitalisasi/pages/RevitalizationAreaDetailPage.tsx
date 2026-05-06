import { getRevitalizationProgramLogById } from "@/features/revitalisasi/actions/revitalization-program-logs";
import { notFound } from "next/navigation";
import RevitalizationAreaDetailClientPage from "./RevitalizationAreaDetailClientPage";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";
import { REVITALIZATION_BREADCRUMBS } from "../constants/revitalization-breadcrumbs";
import { REVITALIZATION_AREAS } from "../constants/revitalization-area";
import {
  BriefcaseIcon,
  TrendingUpIcon,
  ConstructionIcon,
  GoalIcon,
  AlertTriangleIcon,
  RefreshCcwIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RevitalizationProgramLog } from "@/features/revitalisasi/types/revitalization";
import { cn, formatDate } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

/**
 * Komponen halaman detail untuk satu entri laporan revitalisasi.
 * Menampilkan data lengkap termasuk timeline, overview, narasi, dan dokumentasi.
 * Route: /dashboard/revitalisasi/report/[id]
 */
export default async function RevitalizationAreaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let report;
  try {
    report = await getRevitalizationProgramLogById(id);
  } catch (error) {
    console.error("Error loading revitalization report:", error);
    return notFound();
  }

  if (!report?.data) {
    return notFound();
  }

  const data = report.data;
  const area = REVITALIZATION_AREAS.find((a) => a.id === data.area_id);
  const areaName = area ? area.name : `Area ${data.area_id}`;

  const breadcrumbItems = [
    REVITALIZATION_BREADCRUMBS.DASHBOARD,
    REVITALIZATION_BREADCRUMBS.REVITALISASI,
    {
      label: area?.name ?? "Detail",
      href: area ? `/dashboard/revitalisasi/${area.slug}` : undefined,
    },
    REVITALIZATION_BREADCRUMBS.DETAIL,
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-4 sm:pb-10">
      <div className="space-y-2">
        <BreadcrumbHeader items={breadcrumbItems} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {data.name}
            </h1>
            <div className="text-muted-foreground mt-1 text-sm font-medium">
              Area: {areaName}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Dates Info Section */}
        <TimelineInfo data={data} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            <Overview data={data} />
            <Narrative data={data} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ProgressCard data={data} />
          </div>
        </div>

        <RevitalizationAreaDetailClientPage data={data} />
      </div>
    </div>
  );
}

function TimelineInfo({ data }: { data: RevitalizationProgramLog }) {
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

function Overview({ data }: { data: RevitalizationProgramLog }) {
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

function Narrative({ data }: { data: RevitalizationProgramLog }) {
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

function ProgressCard({ data }: { data: RevitalizationProgramLog }) {
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
