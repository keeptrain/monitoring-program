import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getThematicProgramsPaginatedQueryOptions } from "@/features/thematic/api/getBioflocProgramsPaginated";
import { notFound } from "next/navigation";
import { BioflocProgramsPaginatedInput } from "@/features/thematic/forms/biofloc-program-query-schema";
import ThematicProgramPage from "@/features/thematic/ThematicProgramPage";

const DEFAULT_QUERY_PARAMS: Omit<BioflocProgramsPaginatedInput, "scope"> = {
  page: 1,
  pageSize: 10,
  search: "",
  province: "",
  year: undefined,
  status: "",
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

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    getThematicProgramsPaginatedQueryOptions(
      type,
      DEFAULT_QUERY_PARAMS,
      "internal",
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ThematicProgramPage programType={type} />
    </HydrationBoundary>
  );
}
