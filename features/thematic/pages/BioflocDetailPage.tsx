import {
  CreditCardIcon,
  FileTextIcon,
  MapPinIcon,
  PencilIcon,
  ShieldCheckIcon,
  ChartAreaIcon,
} from "lucide-react";
import { ThematicProgramDetailComponent as Component } from "@/features/thematic/components/ThematicProgramDetail";
import { CycleDataDetail } from "@/features/thematic/components/biofloc-detail/CycleDataDetail";
import { InformationDetail } from "@/features/thematic/components/biofloc-detail/InformationDetail";
import { getThematicProgramById } from "@/features/thematic/actions/biofloc";
import { ThematicProgramDetail } from "@/features/thematic/types/thematic";
import { notFound } from "next/navigation";
import { LinkBackButton } from "@/components/shared/LinkBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { formatDateWithTime } from "@/lib/utils";

interface BioflocDetailPageProps {
  params: Promise<{ id: string; type: string }>;
}

export default async function BioflocDetailPage({
  params,
}: BioflocDetailPageProps) {
  const { id, type } = await params;
  const programId = Number(id);

  if (Number.isNaN(programId) || (type !== "biofloc" && type !== "minapadi")) {
    return notFound();
  }

  let program;
  try {
    program = await getThematicProgramById(programId);
  } catch (error) {
    console.error("Error loading thematic program detail:", error);
    return notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
            Dashboard / Tematik / {type} / Detail
          </p>
          <div className="flex items-center gap-1">
            <LinkBackButton href={`/dashboard/thematic/${type}`} />
            <h1 className="text-foreground text-lg font-semibold tracking-tight md:text-xl">
              {program.name}
            </h1>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-start gap-2">
              <MapPinIcon className="size-4" />
              <p className="text-muted-foreground">
                {program.address || "Lokasi tidak diketahui"}
              </p>
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="col-span-2 flex items-end justify-between">
          <p className="text-muted-foreground text-sm">
            Terakhir diperbarui: {formatDateWithTime(program.updated_at)}
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/thematic/form/${program.id}`}>
              <PencilIcon className="size-4" /> Ubah Data
            </Link>
          </Button>
        </div>
        <div className="col-span-2 md:col-span-1">
          <KusukaInformation data={program} />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={program.progress_percent} />
              <p className="text-foreground mt-2 text-sm font-semibold tracking-tight">
                {program.progress_percent}%
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2">
          <InformationDetail data={program} />
        </div>
        <div className="col-span-2 md:col-span-1">
          <CycleDataDetail />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartAreaIcon className="size-4" />
                Kurva S
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <p className="text-muted-foreground text-sm italic">
                  Kurva S belum tersedia
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2 space-y-6">
          <Component
            documentations={program.documentations}
            location={{
              latitude: program.available_locations.latitude,
              longitude: program.available_locations.longitude,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function KusukaInformation({ data }: { data: ThematicProgramDetail }) {
  return (
    <Card className="rounded-none">
      <CardContent className="flex flex-col divide-y divide-zinc-200/50 p-0">
        {/* KUSUKA Number */}
        <div className="flex items-center gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center bg-blue-50">
            <CreditCardIcon className="size-5 text-blue-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
              Nomor KUSUKA
            </p>
            <p className="text-foreground text-sm font-semibold tracking-tight">
              {data.kusuka_number || "-"}
            </p>
          </div>
        </div>

        {/* NIB */}
        <div className="flex items-center gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center bg-emerald-50">
            <FileTextIcon className="size-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
              Nomor NIB
            </p>
            <p className="text-foreground text-sm font-semibold tracking-tight">
              {data.nib || "-"}
            </p>
          </div>
        </div>

        {/* Legal Entity */}
        <div className="flex items-center gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center bg-amber-50">
            <ShieldCheckIcon className="size-5 text-amber-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
              Badan Hukum
            </p>
            <p className="text-foreground text-sm font-semibold tracking-tight">
              {data.legal_entity_number || "-"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
