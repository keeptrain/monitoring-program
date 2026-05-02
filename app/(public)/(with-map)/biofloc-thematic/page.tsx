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

export default async function MonitoringBioflocThematicPage() {
  const type: ThematicType = "biofloc_thematic";
  const queryClient = new QueryClient();

  const { data, proposal_total } = await queryClient.fetchQuery(
    getThematicProgramQuotasQueryOptions("biofloc_thematic"),
  );

  return (
    <>
      <MonitoringThematicHeader thematicType={type} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
          <TotalIncomingProposals value={proposal_total} />
          <div className="lg:col-span-4">
            <ProposalProvinceTable data={data} />
          </div>
          <div className="lg:col-span-6">
            <LazyThematicProposalTable />
          </div>
        </div>
      </HydrationBoundary>
    </>
  );
}
