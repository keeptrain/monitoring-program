import { notFound, redirect } from "next/navigation";
import { getProposalBioflocDetail } from "@/features/thematic/actions/proposal-biofloc";
import ProposalEditClient from "@/features/proposal/components/ProposalEditClient";

export default async function ProposalEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ step?: string }>;
}) {
  const { id } = await params;
  const data = await getProposalBioflocDetail(id).catch(() => null);

  if (!data) notFound();

  // Only allow editing if rejected or revision
  if (data.status !== "rejected" && data.status !== "revision") {
    redirect(`/biofloc-thematic/proposal/${id}`);
  }

  return (
    <ProposalEditClient
      proposalId={id}
      initialData={data}
      searchParams={searchParams}
    />
  );
}
