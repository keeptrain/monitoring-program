"use client";

import { CameraIcon } from "lucide-react";
import { useGetDocumentationGroupsByTypeAndId } from "@/features/documentation/api/getDocumentationGroupsByTypeAndId";
import { CarouselDApiDemo } from "@/components/shared/DocumentationCarouselGallery";

export default function RevitalizationAreaDetailClientPage({
  data,
}: {
  data: { id: string };
}) {
  return (
    <div className="space-y-6">
      {/* Full Width Documentation */}
      <DocumentationSection programId={data.id} />
    </div>
  );
}

function DocumentationSection({ programId }: { programId: string }) {
  const { data: groups, isPending } = useGetDocumentationGroupsByTypeAndId(
    "revitalization",
    programId,
    true,
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
