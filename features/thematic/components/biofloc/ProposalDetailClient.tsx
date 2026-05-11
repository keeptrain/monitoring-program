"use client";

import { CameraIcon, MapIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useGetDocumentationGroupsByTypeAndId } from "@/features/documentation/api/getDocumentationGroupsByTypeAndId";
import { CarouselDApiDemo } from "@/components/shared/DocumentationCarouselGallery";
import { ProposalDownloadButton } from "@/features/proposal/components/tables/ProposalDownloadButton";

const LazyMap = dynamic(() => import("@/components/shared/MapPinPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full animate-pulse rounded-lg bg-zinc-100" />
  ),
});

interface ProposalDetailClientProps {
  id: string;
  locations: { latitude: number; longitude: number };
}

export default function ProposalDetailClient({
  id,
  locations,
}: ProposalDetailClientProps) {
  const { data: groups, isPending } = useGetDocumentationGroupsByTypeAndId(
    "proposal_biofloc_thematic",
    id,
  );

  const proposalImages =
    groups?.flatMap((group) => group.beforeUrls ?? []).filter(Boolean) ?? [];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-end gap-2">
        <p className="text-base font-semibold">Download Dokumen Proposal:</p>
        <ProposalDownloadButton id={id} />
      </div>
      <div className="space-y-2">
        <span className="flex items-center gap-2">
          <CameraIcon className="size-4" />
          <h2 className="text-base font-semibold">Dokumentasi Proposal</h2>
        </span>
        {isPending ? (
          <div className="h-40 w-full animate-pulse rounded-lg bg-zinc-100" />
        ) : (
          <CarouselDApiDemo
            images={proposalImages.map((src) => ({ src }))}
            emptyLabel="Dokumentasi Proposal"
          />
        )}
      </div>
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
  );
}
