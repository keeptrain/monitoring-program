import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProposalThematicPaginated } from "@/features/thematic/actions/proposal-thematic-internal-actions";
import { getProposalThematicQueryKey } from "@/features/thematic/api/getProposalThematicPaginated";
import ProposalProgramPage from "@/features/thematic/pages/ProposalProgramPage";
import { notFound } from "next/navigation";
import { getSessionCached } from "@/features/auth/session";

export default async function ThematicProposalPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (type !== "biofloc" && type !== "minapadi") {
    return notFound();
  }

  const { role } = await getSessionCached();

  const programType =
    type === "minapadi" ? "minapadi_thematic" : "biofloc_thematic";
  const basePath =
    type === "minapadi" ? "/minapadi-thematic" : "/biofloc-thematic";

  const queryClient = new QueryClient();

  const defaultParams = {
    page: 1,
    pageSize: 20,
    province: "",
    search: "",
    programType: programType,
  };

  await queryClient.prefetchQuery({
    queryKey: getProposalThematicQueryKey(defaultParams),
    queryFn: () => getProposalThematicPaginated(defaultParams),
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProposalProgramPage
          role={role}
          basePath={basePath}
          programType={programType}
        />
      </HydrationBoundary>
    </div>
  );
}
