import PublicBioflocProposalSection from "@/features/monitoring/components/biofloc/PublicBioflocProposalSection";
import { checkRoleGuard } from "@/proxy";
import { session } from "@/features/auth/session";

export default async function RootPublicPage() {
  // 1. Centralized Role Check
  await checkRoleGuard("biofloc-thematic");

  const sessionData = await session();

  return (
    <>
      <PublicBioflocProposalSection session={sessionData} />
    </>
  );
}
