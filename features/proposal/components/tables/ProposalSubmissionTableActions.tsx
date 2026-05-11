import { UserRole } from "@/features/auth/types/user";
import { ConvertProposalButton } from "@/features/thematic/components/biofloc/ConvertProposalButton";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { ProposalBioflocThematicProgram } from "../../types/proposal-biofloc";
import { ProposalDownloadButton } from "./ProposalDownloadButton";

export default function ProposalSubmissionTableActions({
  data,
  role,
  onAction,
}: {
  data: ProposalBioflocThematicProgram;
  role?: UserRole;
  onAction?: (
    data: ProposalBioflocThematicProgram,
    action: "verify" | "convert",
  ) => void;
}) {
  const isPmo = role === "pmo";

  return (
    <div className="flex items-center gap-2">
      {/* Verifikasi hanya untuk PMO dan status pending */}
      {data.status === "pending" && isPmo && onAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAction(data, "verify");
          }}
          title="Verifikasi"
        >
          <Check className="size-4" />
          Verifikasi
        </Button>
      )}

      {/* Perbaikan hanya untuk Officer dan status rejected */}
      {data.status === "rejected" && role === "officer" && (
        <Button asChild size="sm" variant="outline">
          <Link
            href={`/biofloc-thematic/proposal/${data.id}/revision`}
            onClick={(e) => e.stopPropagation()}
          >
            Perbaiki
          </Link>
        </Button>
      )}

      {/* Potensial (Convert) hanya untuk PMO dan status approved */}
      {data.status === "approved" && isPmo && onAction && (
        <ConvertProposalButton
          proposalId={data.id}
          proposalName={data.kdmp_entities.name}
        />
      )}

      {/* Download untuk semua yang login */}
      <ProposalDownloadButton id={data.id} />
    </div>
  );
}
