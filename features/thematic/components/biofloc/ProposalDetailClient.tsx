"use client";

import { CameraIcon, MapIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useGetDocumentationGroupsByTypeAndId } from "@/features/documentation/api/getDocumentationGroupsByTypeAndId";
import { CarouselDApiDemo } from "@/components/shared/DocumentationCarouselGallery";

const LazyMap = dynamic(() => import("@/components/shared/MapPinPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full animate-pulse rounded-lg bg-zinc-100" />
  ),
});

export default function ProposalDetailClient({
  id,
  programType,
  locations,
}: {
  id: string;
  programType: string;
  locations: { latitude: number; longitude: number };
}) {
  const documentType = `proposal_${programType}`;
  const { data: groups, isPending } = useGetDocumentationGroupsByTypeAndId(
    documentType,
    id,
  );

  const proposalImages =
    groups?.flatMap((group) => group.beforeUrls ?? []).filter(Boolean) ?? [];

  return (
    <div className="space-y-6 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-4">
          <span className="flex items-center gap-2">
            <CameraIcon className="size-4" />
            <h2 className="text-base font-semibold">Dokumentasi</h2>
          </span>
          {isPending ? (
            <div className="h-[350px] max-w-md animate-pulse rounded-lg bg-zinc-100" />
          ) : (
            <div className="max-w-md">
              <CarouselDApiDemo
                images={proposalImages.map((src) => ({ src }))}
                emptyLabel="Dokumentasi Proposal"
              />
            </div>
          )}
        </div>
        <div className="space-y-4">
          <span className="flex items-center gap-2">
            <MapIcon className="size-4" />
            <h2 className="text-base font-semibold">Lokasi</h2>
          </span>
          <LazyMap
            disabled
            value={{
              latitude: locations.latitude,
              longitude: locations.longitude,
            }}
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
