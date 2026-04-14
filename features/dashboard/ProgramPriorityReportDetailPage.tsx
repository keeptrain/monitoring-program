"use client";

import { ProgramPriorityReportDetail } from "./actions/program-priority-reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatDateWithTime } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, MapPin, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
            <Button variant="ghost" size="icon-xs" asChild>
              <Link href="/dashboard/program-priority-report">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
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
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
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
            <div className="flex items-center justify-between gap-4">
              <Progress
                value={data.percentage_of_work}
                className="h-3 flex-1"
              />
              <span className="text-xl font-bold tabular-nums">
                {data.percentage_of_work}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Narrative Details */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Kendala</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
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
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
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
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Sebelum
                      </p>
                      <div className="aspect-video overflow-hidden border border-border bg-muted">
                        {doc.image_before_path ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/demo/${doc.image_before_path}`}
                            alt="Visual sebelum pengerjaan"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-muted-foreground italic">
                            Tidak ada foto
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Sesudah
                      </p>
                      <div className="aspect-video overflow-hidden border border-border bg-muted">
                        {doc.image_after_path ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/demo/${doc.image_after_path}`}
                            alt="Visual sesudah pengerjaan"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-muted-foreground italic">
                            Tidak ada foto
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {(!data.documentations || data.documentations.length === 0) && (
                <div className="py-10 text-center text-sm text-muted-foreground italic">
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
