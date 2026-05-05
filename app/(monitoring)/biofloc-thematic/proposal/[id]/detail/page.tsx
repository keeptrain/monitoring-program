import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProposalBioflocDetailQueryOptions } from "@/features/thematic/api/getProposalBioflocDetail";
import { ProposalBioflocDetailContent } from "@/features/proposal/components/ProposalBioflocDetailContent";

/**
 * (public)/biofloc-thematic/proposal/[id]/detail/page.tsx
 */
export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getProposalBioflocDetailQueryOptions(id));

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="mx-auto mt-8 mb-4 max-w-6xl space-y-6">
      <HydrationBoundary state={dehydratedState}>
        <ProposalBioflocDetailContent id={id} />
      </HydrationBoundary>
    </div>
  );
}
