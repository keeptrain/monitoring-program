import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getRevitalizationAreasLatestQueryOptions } from "../api/getRevitalizationAreasLatest";
import RevitalizationClientPage from "./RevitalizationClientPage";
import BreadcrumbHeader from "@/components/shared/BreadcrumbHeader";
import { Suspense } from "react";
import { RevitalizationDashboardSkeleton } from "../components/RevitalizationDashboardSkeleton";
import { REVITALIZATION_BREADCRUMBS } from "../constants/revitalization-breadcrumbs";

const breadcrumbItems = [
  REVITALIZATION_BREADCRUMBS.DASHBOARD,
  REVITALIZATION_BREADCRUMBS.REVITALISASI,
];

/**
 * Komponen halaman utama untuk modul Revitalisasi.
 * Menampilkan ringkasan status revitalisasi di seluruh area.
 * Route: /dashboard/revitalisasi
 */
export default async function RevitalizationPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getRevitalizationAreasLatestQueryOptions);

  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="space-y-2">
        <BreadcrumbHeader items={breadcrumbItems} />
        <h1 className="text-xl font-semibold tracking-tight">
          Program Revitalisasi Tambak
        </h1>
        <p className="text-muted-foreground text-sm">
          Monitoring Revitalisasi Tambak Pantura.
        </p>
      </div>
      <Suspense fallback={<RevitalizationDashboardSkeleton />}>
        <HydrationBoundary state={dehydratedState}>
          <RevitalizationClientPage />
        </HydrationBoundary>
      </Suspense>
    </div>
  );
}
