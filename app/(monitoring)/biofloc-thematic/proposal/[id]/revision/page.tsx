import ProposalThematicRevisionPage from "@/features/proposal/pages/ProposalThematicRevisionPage";

export default async function BioflocProposalRevisionRoute({
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
      programType="biofloc_thematic"
      basePath="/biofloc-thematic"
    />
  );
}
