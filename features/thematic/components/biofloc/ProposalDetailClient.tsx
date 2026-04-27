"use client";

import { ProposalDownloadButton } from "@/features/monitoring/components/biofloc/ProposalSubmissionTableColumns";
import { MapIcon } from "lucide-react";
import dynamic from "next/dynamic";

const LazyMap = dynamic(() => import("@/components/shared/MapPinPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full animate-pulse rounded-lg bg-zinc-100" />
  ),
});

interface ProposalDetailClientProps {
  id: number;
  locations: { latitude: number; longitude: number };
}

export default function ProposalDetailClient({
  id,
  locations,
}: ProposalDetailClientProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ProposalDownloadButton id={id} />
        <p>Dokumen Proposal</p>
      </div>
      <span className="flex items-center gap-2">
        <MapIcon className="size-4" />
        <h2 className="text-lg font-semibold">Lokasi</h2>
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
