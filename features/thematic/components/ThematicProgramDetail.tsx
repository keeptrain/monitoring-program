"use client";

import { CameraIcon, MapIcon } from "lucide-react";
import {
  DocumentationGallery,
  DocumentationItem,
} from "@/components/shared/DocumentationGallery";
import dynamic from "next/dynamic";
import { useInViewOnce } from "@/hooks/useInViewOnce";

const LazyMapPinPicker = dynamic(
  () => import("@/components/shared/MapPinPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full animate-pulse rounded-lg bg-zinc-100" />
    ),
  },
);

export function ThematicProgramDetailComponent({
  documentations,
  location,
}: {
  documentations: DocumentationItem[];
  location: { latitude: number; longitude: number };
}) {
  const { ref: galleryRef, isInView: galleryInView } =
    useInViewOnce<HTMLDivElement>({
      rootMargin: "100px",
    });
  const { ref: mapRef, isInView: mapInView } = useInViewOnce<HTMLDivElement>({
    rootMargin: "100px",
  });

  return (
    <>
      <div className="flex items-center gap-2">
        <CameraIcon className="size-4" />
        <h1 className="font-semibold">Dokumentasi</h1>
      </div>
      <div ref={galleryRef}>
        {galleryInView ? (
          <DocumentationGallery documentations={documentations} />
        ) : (
          <div className="h-[200px] w-full animate-pulse rounded-lg bg-zinc-100" />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapIcon className="size-4" />
          <p className="font-semibold">Lokasi</p>
        </div>
        <div ref={mapRef} className="min-h-[320px]">
          {mapInView && (
            <LazyMapPinPicker
              value={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              onChange={() => {}}
              disabled
            />
          )}
        </div>
      </div>
    </>
  );
}
