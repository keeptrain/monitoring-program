import ProposalThematicFormPage from "@/features/proposal/ProposalThematicFormPage";

/**
 * (monitoring)/biofloc-thematic/proposal
 * @param props
 * @returns
 */
export default function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <ProposalThematicFormPage
      searchParams={props.searchParams}
      programType="biofloc_thematic"
      basePath="/biofloc-thematic"
    />
  );
}
