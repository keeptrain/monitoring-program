import z from "zod";
import { getRevisionProposal } from "../api/proposal-actions";
import { redirect } from "next/navigation";
import ProposalThematicFormPage from "./ProposalThematicFormPage";

const uuidV7Schema = z.uuidv7();

export default async function ProposalThematicRevisionPage({
  params,
  searchParams,
  programType,
  basePath,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  programType: string;
  basePath: string;
}) {
  const { id } = await params;

  // Validate UUIDv7 using Zod
  const result = uuidV7Schema.safeParse(id);

  if (!result.success) {
    return <div className="text-destructive mx-auto max-w-6xl">Invalid ID</div>;
  }

  const proposal = await getRevisionProposal(result.data);

  if (!proposal.success) {
    redirect(basePath);
  }

  return (
    <ProposalThematicFormPage
      searchParams={searchParams}
      initialData={proposal.data}
      proposalId={id}
      programType={programType}
      basePath={basePath}
    />
  );
}
