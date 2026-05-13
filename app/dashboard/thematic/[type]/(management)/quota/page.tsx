import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getBioflocProgramQuotas } from "@/features/thematic/actions/program-quotas";
import { getThematicProgramQuotasQueryKey } from "@/features/thematic/api/getThematicProgramQuotas";
import ManagementQuotaPage from "@/features/thematic/pages/ManagementQuotaPage";
import { notFound } from "next/navigation";
import { ThematicType } from "@/features/thematic/constants/filter-state";

export default async function ThematicQuotaPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (type !== "biofloc" && type !== "minapadi") {
    return notFound();
  }

  const programType: ThematicType =
    type === "minapadi" ? "minapadi_thematic" : "biofloc_thematic";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: getThematicProgramQuotasQueryKey(programType),
    queryFn: () => getBioflocProgramQuotas(programType),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ManagementQuotaPage programType={programType} />
    </HydrationBoundary>
  );
}
