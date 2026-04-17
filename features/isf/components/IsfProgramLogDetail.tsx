"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IsfProgramLog } from "../types/isf";
import { formatDateWithTime } from "@/lib/utils";
import { LinkBackButton } from "@/components/shared/LinkBackButton";
import {
  CalendarDays,
  MapPin,
  PencilIcon,
  Percent,
  Users,
  Building2,
  Construction,
  Trophy,
  AlertCircle,
  TrendingUp,
  CameraIcon,
  ChartAreaIcon,
} from "lucide-react";

export default function IsfProgramLogDetail({ data }: { data: IsfProgramLog }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
            Dashboard / ISF / Laporan / Detail
          </p>
          <div className="flex items-center gap-2">
            <LinkBackButton href={`/dashboard/isf/${data.step_id}`} />
            <h1 className="text-foreground text-2xl font-semibold tracking-tight">
              {data.name}
            </h1>
          </div>
          <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              Zona {data.step_id}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {formatDateWithTime(data.progress_date)}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/isf/report/${data.id}/edit`}>
              <PencilIcon className="mr-2 size-4" /> Ubah Laporan
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main content - 2/3 width on md+ */}
        <div className="space-y-6 md:col-span-2">
          {/* Card: Ringkasan Capaian */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="text-primary size-5" />
                Ringkasan Capaian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Outcome (Hasil)
                </h4>
                <p className="text-foreground text-sm leading-relaxed">
                  {data.outcome}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-muted-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                    <AlertCircle className="size-3" /> Kendala
                  </h4>
                  <p className="text-foreground text-sm leading-relaxed italic">
                    {data.constraints || "Tidak ada kendala yang dilaporkan"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-muted-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                    <TrendingUp className="size-3" /> Tindak Lanjut
                  </h4>
                  <p className="text-foreground text-sm leading-relaxed">
                    {data.follow_up || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Kurva S & Dokumentasi Placeholder */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-bold">
                  <ChartAreaIcon className="size-4" />
                  Kurva S
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-muted/20 flex h-32 items-center justify-center border-t">
                <p className="text-muted-foreground text-xs italic">
                  S-Curve belum tersedia
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-bold">
                  <CameraIcon className="size-4" />
                  Dokumentasi
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-muted/20 flex h-32 items-center justify-center border-t">
                <p className="text-muted-foreground text-xs italic">
                  Foto dokumentasi belum ada
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar content - 1/3 width on md+ */}
        <div className="space-y-6 lg:sticky lg:top-6">
          {/* Card: Status & Progress */}
          <Card className="border-primary/20 bg-primary/5 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold tracking-widest uppercase">
                Status Progres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2 text-xs font-bold uppercase">
                    <Percent className="size-3" /> Akumulasi Capaian
                  </span>
                  <span className="text-primary text-xl font-black italic">
                    {data.progress_percent}%
                  </span>
                </div>
                <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full transition-all duration-500 ease-in-out"
                    style={{ width: `${data.progress_percent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-muted-foreground text-xs font-bold uppercase">
                  Status Berjalan
                </span>
                <span className="bg-primary px-2 py-0.5 text-[10px] font-black tracking-tighter text-white uppercase italic shadow-sm">
                  {data.status}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card: Informasi Detail */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
                Detail Administrasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 border-t pt-5">
              <DetailItem
                icon={<Building2 className="text-primary size-3.5" />}
                label="Nama Penyedia"
                value={data.provider_name}
              />
              <DetailItem
                icon={<Construction className="text-primary size-3.5" />}
                label="Jenis Intervensi"
                value={data.intervention}
              />
              <DetailItem
                icon={<Trophy className="text-primary size-3.5" />}
                label="Volume Produksi"
                value={data.production}
              />
              <DetailItem
                icon={<Users className="text-primary size-3.5" />}
                label="Serapan Tenaga Kerja"
                value={`${data.total_worker} Orang`}
              />
            </CardContent>
          </Card>

          <p className="text-muted-foreground text-center text-[10px] font-medium italic">
            Terakhir diperbarui: {formatDateWithTime(data.updated_at)}
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="group flex flex-col gap-1.5 transition-all">
      <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
        {icon}
        {label}
      </div>
      <div className="text-foreground group-hover:text-primary pl-5 text-sm font-semibold transition-colors">
        {value || "-"}
      </div>
    </div>
  );
}
