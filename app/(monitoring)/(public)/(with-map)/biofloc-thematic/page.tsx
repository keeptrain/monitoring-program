import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ProposalProvinceTable from "@/features/monitoring/components/biofloc/ProposalProvinceTable";
import TotalIncomingProposals from "@/features/monitoring/components/thematic/TotalIncomingProposals";
import MonitoringThematicHeader from "@/features/monitoring/components/thematic/MonitoringThematicHeader";
import { getThematicProgramQuotasQueryOptions } from "@/features/monitoring/api/getBioflocProgramQuotas";
import LazyThematicProposalTable from "@/features/monitoring/components/thematic/LazyThematicProposalTable";
import { ThematicType } from "@/features/thematic/constants/filter-state";
import { getSessionCached } from "@/features/auth/session";

export default async function MonitoringBioflocThematicPage() {
  const type: ThematicType = "biofloc_thematic";
  const { role } = await getSessionCached();

  const queryClient = new QueryClient();
  const options = getThematicProgramQuotasQueryOptions(type);
  await queryClient.prefetchQuery(options);

  const cachedData = queryClient.getQueryData(options.queryKey);
  const proposal_total = cachedData?.proposal_total ?? 0;

  return (
    <>
      <MonitoringThematicHeader thematicType={type} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
        <TotalIncomingProposals value={proposal_total} />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <div className="lg:col-span-4">
            <ProposalProvinceTable thematicType={type} />
          </div>
        </HydrationBoundary>
        <div className="lg:col-span-6">
          <LazyThematicProposalTable role={role} programType={type} />
        </div>
      </div>
    </>
  );
}
