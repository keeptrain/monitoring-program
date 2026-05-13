import ProposalThematicPage from "@/features/proposal/ProposalThematicPage";

export default async function MinapadiProposalRoute({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <ProposalThematicPage
      searchParams={searchParams}
      programType="minapadi_thematic"
      basePath="/minapadi-thematic"
    />
  );
}
