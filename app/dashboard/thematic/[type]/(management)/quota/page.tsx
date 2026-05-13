import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getBioflocProgramQuotas } from "@/features/thematic/actions/program-quotas";
import { getBioflocProgramQuotasQueryKey } from "@/features/thematic/api/getBioflocProgramQuotas";
import ManagementQuotaPage from "@/features/thematic/pages/ManagementQuotaPage";
import { notFound } from "next/navigation";
import React from "react";

const PAGE_CONFIG: Record<
  string,
  {
    label: string;
    Component: React.ComponentType;
  }
> = {
  biofloc: {
    label: "Manajemen Kuota Bioflok",
    Component: ManagementQuotaPage,
  },
  minapadi: {
    label: "Manajemen Kuota Minapadi",
    Component: () => (
      <div className="bg-muted flex h-40 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground text-sm italic">
          Halaman manajemen kuota Minapadi sedang dalam pengembangan.
        </p>
      </div>
    ),
  },
};

export default async function ThematicQuotaPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (type !== "biofloc" && type !== "minapadi") {
    return notFound();
  }

  const queryClient = new QueryClient();

  // Prefetch only if biofloc for now
  if (type === "biofloc") {
    await queryClient.prefetchQuery({
      queryKey: getBioflocProgramQuotasQueryKey(),
      queryFn: () => getBioflocProgramQuotas("biofloc_thematic"),
    });
  }

  const config = PAGE_CONFIG[type];
  const ComponentPage = config.Component;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ComponentPage />
    </HydrationBoundary>
  );
}
