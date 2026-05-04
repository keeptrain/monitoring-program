import z from "zod";
import { getRevisionProposal } from "./api/proposal-actions";
import { redirect } from "next/navigation";
import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ProposalThematicPage from "./ProposalThematicPage";

const uuidV7Schema = z.uuidv7();

export default async function ProposalThematicRevisionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;

  // Validate UUIDv7 using Zod
  const result = uuidV7Schema.safeParse(id);

  if (!result.success) {
    return <div className="text-destructive mx-auto max-w-6xl">Invalid ID</div>;
  }

  const proposal = await getRevisionProposal(result.data);

  if (!proposal.success) {
    redirect("/biofloc-thematic");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
        <AlertTriangleIcon className="size-4" />
        <AlertTitle>Proposal kamu ditolak</AlertTitle>
        <AlertDescription>
          Dengan catatan: {proposal.data?.revisionReason || "-"}. Silakan revisi
          proposal kamu berdasarkan catatan yang diberikan.
        </AlertDescription>
      </Alert>

      <ProposalThematicPage
        searchParams={searchParams}
        initialData={proposal.data}
        proposalId={id}
      />
    </div>
  );
}
