import ProposalThematicDetailPage from "@/features/proposal/pages/ProposalThematicDetailPage";

/**
 * (public)/biofloc-thematic/proposal/[id]/detail/page.tsx
 */
export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <ProposalThematicDetailPage
      params={params}
      programType="biofloc_thematic"
    />
  );
}
