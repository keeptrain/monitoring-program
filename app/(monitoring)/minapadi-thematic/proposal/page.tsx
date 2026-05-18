import ProposalThematicFormPage from "@/features/proposal/pages/ProposalThematicFormPage";

/**
 * (monitoring)/biofloc-thematic/minapadi-thematic/proposal
 * @param props
 * @returns
 */
export default function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <ProposalThematicFormPage
      searchParams={props.searchParams}
      programType="minapadi_thematic"
      basePath="/minapadi-thematic"
    />
  );
}
