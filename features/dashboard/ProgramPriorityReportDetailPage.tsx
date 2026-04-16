"use client";

import { ProgramPriorityReportDetail } from "./actions/program-priority-reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateWithTime } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Tag } from "lucide-react";
import { LinkBackButton } from "@/components/shared/LinkBackButton";
import Image from "next/image";
import { ProgressPercentage } from "../monitoring/components/ProgressPercentage";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") || "";

export default function ProgramPriorityReportDetailPage({
  data,
}: {
  data: ProgramPriorityReportDetail;
}) {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Header Info */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LinkBackButton href="/dashboard/program-priority-report" />
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              {data.name}
            </h1>
          </div>
          <Badge
            variant={data.status === "Selesai" ? "default" : "outline"}
            className="px-3 py-1"
          >
            {data.status}
          </Badge>
        </div>
        <div className="text-muted-foreground mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            {data.available_locations?.name}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            {formatDateWithTime(data.created_at)}
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="size-4" />
            {data.provider_type}
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Progress Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Capaian Pekerjaan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressPercentage value={data.percentage_of_work} />
          </CardContent>
        </Card>

        {/* Narrative Details */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Kendala</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                {data.constraints || "Tidak ada kendala yang dilaporkan."}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Tindak Lanjut
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                {data.follow_up || "Belum ada rencana tindak lanjut."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Documentation Gallery */}
        <Card>
          <CardHeader>
            <CardTitle>Dokumentasi Visual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {data.documentations?.map((doc, index) => (
                <div key={doc.id || index} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-full px-2">
                      {index + 1}
                    </Badge>
                    <Separator className="flex-1" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Sebelum
                      </p>
                      <div className="border-border bg-muted aspect-video overflow-hidden border">
                        {doc.image_before_path ? (
                          <Image
                            src={`${supabaseUrl}/storage/v1/object/public/demo/${doc.image_before_path}`}
                            alt="Visual sebelum pengerjaan"
                            className="object-cover"
                            width={500}
                            height={500}
                            unoptimized
                          />
                        ) : (
                          <div className="text-muted-foreground flex h-full items-center justify-center text-xs italic">
                            Tidak ada foto
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Sesudah
                      </p>
                      <div className="border-border bg-muted aspect-video overflow-hidden border">
                        {doc.image_after_path ? (
                          <Image
                            src={`${supabaseUrl}/storage/v1/object/public/demo/${doc.image_after_path}`}
                            alt="Visual sesudah pengerjaan"
                            className="object-cover"
                            width={500}
                            height={500}
                            unoptimized
                          />
                        ) : (
                          <div className="text-muted-foreground flex h-full items-center justify-center text-xs italic">
                            Tidak ada foto
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {(!data.documentations || data.documentations.length === 0) && (
                <div className="text-muted-foreground py-10 text-center text-sm italic">
                  Belum ada dokumentasi visual untuk laporan ini.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
