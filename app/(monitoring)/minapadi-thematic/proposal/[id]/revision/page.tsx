import ProposalThematicRevisionPage from "@/features/proposal/ProposalThematicRevisionPage";

export default async function MinapadiProposalRevisionRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <ProposalThematicRevisionPage
      params={params}
      searchParams={searchParams}
      programType="minapadi_thematic"
      basePath="/minapadi-thematic"
    />
  );
}
