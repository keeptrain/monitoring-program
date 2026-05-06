import { REVITALIZATION_AREAS } from "../constants/revitalization-area";
import { notFound } from "next/navigation";
import RevitalizationAreaClientPage from "./RevitalizationAreaClientPage";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getRevitalizationByAreaQueryOptions } from "../api/getRevitalizationByArea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";
import { REVITALIZATION_BREADCRUMBS } from "../constants/revitalization-breadcrumbs";

const breadcrumbItems = [
  REVITALIZATION_BREADCRUMBS.DASHBOARD,
  REVITALIZATION_BREADCRUMBS.REVITALISASI,
  REVITALIZATION_BREADCRUMBS.PER_AREA,
];

/**
 * Komponen halaman daftar laporan per area tertentu.
 * Menampilkan daftar riwayat aktivitas dan status untuk area yang dipilih.
 * Route: /dashboard/revitalisasi/[area]
 */
export default async function RevitalizationAreaPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area: slug } = await params;

  // Find area by slug
  const areaInfo = REVITALIZATION_AREAS.find((a) => a.slug === slug);

  // Validation: Only allow existing areas
  if (!areaInfo) {
    notFound();
  }

  const areaName = areaInfo.slug;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getRevitalizationByAreaQueryOptions(slug));
  const dehydrateState = dehydrate(queryClient);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="space-y-2">
        <BreadcrumbHeader items={breadcrumbItems} />
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">
              Detail Area: {areaInfo.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              Kelola data dan pantau progres aktivitas untuk area {areaName}.
            </p>
          </div>
          <Button asChild>
            <Link href={`/dashboard/revitalisasi/${areaName}/create`}>
              <PlusIcon className="size-4" />
              Tambah Laporan
            </Link>
          </Button>
        </div>
      </div>

      <HydrationBoundary state={dehydrateState}>
        <RevitalizationAreaClientPage area={slug} />
      </HydrationBoundary>
    </div>
  );
}
