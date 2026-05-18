import ProposalThematicDetailPage from "@/features/proposal/pages/ProposalThematicDetailPage";

export default async function MinapadiProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <ProposalThematicDetailPage
      params={params}
      programType="minapadi_thematic"
    />
  );
}
