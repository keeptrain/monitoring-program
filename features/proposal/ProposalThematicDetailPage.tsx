import { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProposalThematicQueryOptions } from "@/features/thematic/api/getProposalThematic";
import { ProposalThematicDetailClient } from "@/features/proposal/components/ProposalThematicDetailClient";
import { ProposalDetailSkeleton } from "@/features/proposal/components/ProposalDetailSkeleton";

export default async function ProposalThematicDetailPage({
  params,
  programType,
}: {
  params: Promise<{ id: string }>;
  programType: string;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getProposalThematicQueryOptions(id));

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="mx-auto mt-8 mb-4 max-w-6xl space-y-6">
      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<ProposalDetailSkeleton />}>
          <ProposalThematicDetailClient id={id} programType={programType} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
