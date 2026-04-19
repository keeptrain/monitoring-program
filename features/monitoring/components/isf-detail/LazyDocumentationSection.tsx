"use client";

import { useState, useRef, useEffect } from "react";
import { CameraIcon } from "lucide-react";
import { CarouselDApiDemo } from "@/components/shared/DocumentationCarouselGallery";
import { useGetDocumentationGroupsByTypeAndId } from "@/features/documentation/api/getDocumentationGroupsByTypeAndId";
import { Skeleton } from "@/components/ui/skeleton";

export function LazyDocumentationSection({
  type,
  programId,
}: {
  type: string;
  programId: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { data: groups, isPending } = useGetDocumentationGroupsByTypeAndId(
    type,
    programId,
    isVisible,
  );

  return (
    <div ref={sectionRef} className="space-y-8">
      <div className="flex items-center gap-2">
        <CameraIcon className="size-6" />
        <p className="text-base font-bold tracking-widest">Dokumentasi</p>
      </div>

      {!isVisible || isPending ? (
        <DocumentationGroupSkeleton />
      ) : !groups || groups.length === 0 ? (
        <p className="text-muted-foreground text-xs">
          Belum ada dokumentasi untuk minggu ini.
        </p>
      ) : (
        groups.map((group, index) => (
          <div key={String(group.groupId ?? index)} className="space-y-4">
            {groups.length > 1 && (
              <p className="text-end text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Dokumentasi {index + 1}
              </p>
            )}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <section className="space-y-2">
                <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                  Sebelum
                </p>
                <CarouselDApiDemo
                  images={group.beforeUrls.map((url) => ({ src: url }))}
                  emptyLabel="Sebelum"
                />
              </section>
              <section className="space-y-2">
                <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
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

export function DocumentationGroupSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {[1, 2].map((i) => (
        <Skeleton key={i} className="aspect-4/3 w-full" />
      ))}
    </div>
  );
}
