import dynamic from "next/dynamic";
import { LoadingLazyMap } from "@/features/monitoring/components/LoadingLazyMap";
import { checkRoleGuard } from "@/proxy";
import { session } from "@/features/auth/session";

const LazyPublicBioflocProposalSection = dynamic(
  () =>
    import("@/features/monitoring/components/biofloc/PublicBioflocProposalSection"),
  {
    loading: () => <LoadingLazyMap />,
  },
);

export default async function BioflocMonitoringPage() {
  await checkRoleGuard("biofloc-thematic");
  const sessionData = await session();

  return <LazyPublicBioflocProposalSection session={sessionData} />;
}
