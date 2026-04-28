import BioflocProgramForm from "@/features/thematic/forms/BioflocProgramForm";
import { ThematicFormHeader } from "@/features/thematic/components/ThematicFormHeader";
import { notFound } from "next/navigation";
import ProposalSourceCard from "@/features/thematic/components/biofloc/ProposalSourceCard";
import { getProposalBioflocDetail } from "@/features/thematic/actions/proposal-biofloc";

export default async function CreateThematicProgramPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ proposalId?: string }>;
}) {
  const { type } = await params;
  const { proposalId } = await searchParams;

  if (type !== "biofloc" && type !== "minapadi") {
    return notFound();
  }

  const proposalIdNum = proposalId ? parseInt(proposalId) : undefined;
  if (proposalId && isNaN(proposalIdNum!)) {
    return notFound();
  }

  let initialData: any = null;
  if (proposalIdNum) {
    try {
      const proposal = await getProposalBioflocDetail(proposalIdNum);
      if (proposal.status !== "approved") {
        return notFound();
      }
      // Prepare initial data from proposal with default values for required fields
      initialData = {
        id: 0,
        name: proposal.name,
        location_id: proposal.location_id || 0,
        commodity_aid: "",
        commodity_potential: "",
        land_area: "",
        production_value: "",
        progress_percent: 0,
        total_management: 0,
        total_members: 0,
        distribution_amount: 0,
        sppg_partner: "",
        kusuka_number: "",
        s_curve_path: "",
        available_locations: proposal.available_locations || {
          name: "",
          latitude: 0,
          longitude: 0,
        },
      };
    } catch {
      return notFound();
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <ThematicFormHeader />
      {proposalIdNum && <ProposalSourceCard proposalId={proposalIdNum} />}
      <BioflocProgramForm
        initialData={initialData}
        proposalId={proposalIdNum}
        isConvertingFromProposal={!!proposalIdNum}
      />
    </div>
  );
}
