import { PublicThematicProgram } from "../actions/public-thematic-programs";
import { ProgressPercentage } from "../../monitoring/components/ProgressPercentage";
import Image from "next/image";
import { useState, useMemo, useCallback } from "react";
import { ArrowLeftIcon, ArrowRightIcon, FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";

export default function ThematicPublicMonitoringDetail({
  data,
}: {
  data: PublicThematicProgram | null;
}) {
  const [activeDocIndex, setActiveDocIndex] = useState(0);

  const documentations = data?.documentations || [];
  const activeDoc = documentations[activeDocIndex];
  const totalDocs = documentations.length;

  const toPublicUrl = (path: string | null) => {
    if (!path) return null;
    return `${supabaseUrl}/storage/v1/object/public/documentations/${path}`;
  };

  const beforeUrl = useMemo(
    () => toPublicUrl(activeDoc?.image_before_path ?? null),
    [activeDoc],
  );
  const afterUrl = useMemo(
    () => toPublicUrl(activeDoc?.image_after_path ?? null),
    [activeDoc],
  );

  const handleNext = useCallback(() => {
    setActiveDocIndex((prev) => Math.min(prev + 1, totalDocs - 1));
  }, [totalDocs]);

  const handlePrev = useCallback(() => {
    setActiveDocIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  if (!data) return null;

  return (
    <div className="no-scrollbar h-full space-y-6 overflow-y-auto px-4 pb-10">
      {/* Progress Section */}
      <div className="bg-muted/30 border-border border p-4">
        <p className="text-muted-foreground mb-3 text-[10px] font-bold tracking-widest uppercase">
          Progres Pengerjaan
        </p>
        <ProgressPercentage value={data.percentage_of_work} />
      </div>

      {/* Details Grid */}
      <div>
        <p className="text-muted-foreground mb-3 text-[10px] font-bold tracking-widest uppercase">
          Informasi Program
        </p>
        <div className="bg-muted/20 border-border grid grid-cols-2 gap-px overflow-hidden border">
          <DetailItem label="Komoditas" value={data.commodity} />
          <DetailItem label="Produksi" value={data.production} />
          <DetailItem label="Luas Lahan" value={data.land_area} />
          <DetailItem label="Total Admin" value={data.total_admin} />
          <DetailItem
            label="Penyaluran"
            value={new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(data.distribution_amount)}
          />
          <DetailItem label="Mitra SPPG" value={data.sppg_partner} />
        </div>
      </div>

      {/* S-Curve Link */}
      {data.s_curve_path && (
        <a
          href={`${supabaseUrl}/storage/v1/object/public/documentations/${data.s_curve_path}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-muted/20 border-border hover:bg-muted/30 flex items-center justify-between border px-4 py-3 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-sm">
              <FileTextIcon className="text-primary h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold">Kurva S</p>
              <p className="text-muted-foreground text-[10px]">
                Lihat detail progres pengerjaan
              </p>
            </div>
          </div>
          <ArrowRightIcon className="text-muted-foreground h-4 w-4" />
        </a>
      )}

      {/* Documentation Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
            Dokumentasi
          </p>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-[10px] font-medium">
              {totalDocs > 0 ? `${activeDocIndex + 1} / ${totalDocs}` : "0 / 0"}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-4"
                onClick={handlePrev}
                disabled={activeDocIndex === 0}
              >
                <ArrowLeftIcon className="size-3" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-4"
                onClick={handleNext}
                disabled={activeDocIndex >= totalDocs - 1}
              >
                <ArrowRightIcon className="size-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <DocCard title="Sebelum" url={beforeUrl} />
          <DocCard title="Sesudah" url={afterUrl} />
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-background flex flex-col gap-1 p-3">
      <span className="text-muted-foreground text-[9px] font-semibold tracking-wider uppercase">
        {label}
      </span>
      <span className="text-foreground truncate text-xs leading-tight font-bold uppercase">
        {value ?? "-"}
      </span>
    </div>
  );
}

function DocCard({ title, url }: { title: string; url: string | null }) {
  return (
    <div className="space-y-2">
      <span className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase italic">
        {title}
      </span>
      <div className="bg-muted border-border relative aspect-video w-full overflow-hidden border border-dashed">
        {url ? (
          <Image
            src={url}
            alt={`Foto dokumentasi ${title}`}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground text-[10px] italic">
              Tidak ada dokumentasi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
