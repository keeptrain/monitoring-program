"use client";

import {
  DocumentationGallery,
  DocumentationItem,
} from "@/components/shared/DocumentationGallery";
import { CameraIcon } from "lucide-react";

interface BioflocDetailPageProps {
  id: number;
  documentations: DocumentationItem[];
  location: { latitude: number; longitude: number };
}

export default function BioflocDetailPage({
  documentations,
}: BioflocDetailPageProps) {
  return (
    <>
      <div className="col-span-3">
        <div className="flex items-center gap-2 pb-4">
          <CameraIcon className="size-4" />
          <h1 className="font-semibold">Dokumentasi</h1>
        </div>
        <div className="min-h-[200px]">
          <DocumentationGallery documentations={documentations} />
        </div>
      </div>
    </>
  );
}
