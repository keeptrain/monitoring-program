import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getBioflocProgramsPaginated } from "@/features/thematic/actions/biofloc";
import { getBioflocProgramsPaginatedQueryKey } from "@/features/thematic/api/getBioflocProgramsPaginated";
import BioflocProgramPage from "@/features/thematic/BioflocProgramPage";
import MinapadiProgramPage from "@/features/thematic/MinapadiProgramPage";
import { notFound } from "next/navigation";
import React from "react";
import { BioflocProgramsPaginatedInput } from "@/features/thematic/forms/biofloc-program-query-schema";

const PAGE_CONFIG: Record<
  string,
  {
    label: string;
    Component: React.ComponentType;
  }
> = {
  biofloc: {
    label: "Program Tematik Bioflok",
    Component: BioflocProgramPage,
  },
  minapadi: {
    label: "Program Tematik Minapadi",
    Component: MinapadiProgramPage,
  },
};

export default async function ThematicProgramTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (type !== "biofloc" && type !== "minapadi") {
    return notFound();
  }

  const scope = "internal";
  const defaultQueryParams: BioflocProgramsPaginatedInput = {
    scope,
    page: 1,
    pageSize: 10,
    search: "",
    province: "",
    year: 2026,
  };
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: getBioflocProgramsPaginatedQueryKey(defaultQueryParams),
    queryFn: () => getBioflocProgramsPaginated(defaultQueryParams),
  });

  const config = PAGE_CONFIG[type];
  const ComponentPage = config.Component;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ComponentPage />
    </HydrationBoundary>
  );
}
