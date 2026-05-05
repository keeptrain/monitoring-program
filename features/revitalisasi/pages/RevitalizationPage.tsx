import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getRevitalizationAreasLatestQueryOptions } from "../api/getRevitalizationAreasLatest";
import RevitalizationClientPage from "./RevitalizationClientPage";

export default async function RevitalizationPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getRevitalizationAreasLatestQueryOptions);

  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
            Dashboard / Revitalisasi
          </p>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            Program Revitalisasi Tambak
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitoring Revitalisasi Tambak Pantura.
          </p>
        </div>
      </div>

      {/* Area List wrapped in Suspense */}
      <HydrationBoundary state={dehydratedState}>
        <RevitalizationClientPage />
      </HydrationBoundary>
    </div>
  );
}
