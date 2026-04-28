import { getProposalBioflocDetail } from "@/features/thematic/actions/proposal-biofloc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/features/monitoring/components/biofloc/ProposalSubmissionTableColumns";

export default async function ProposalSourceCard({
  proposalId,
}: {
  proposalId: number;
}) {
  let proposal;
  try {
    proposal = await getProposalBioflocDetail(proposalId);
  } catch {
    return notFound();
  }

  // Check if proposal is approved
  if (proposal.status !== "approved") {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-900">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
          <div>
            <p className="font-semibold">Gagal Mengkonversi Proposal</p>
            <p className="text-sm">
              Hanya proposal yang telah disetujui dapat dikonversi menjadi
              program tematik.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Proposal Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Sumber Proposal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Nama KDMP
              </p>
              <p className="text-sm font-semibold">{proposal.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Status
              </p>
              <StatusBadge status={proposal.status} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Provinsi ID
              </p>
              <p className="text-sm">{proposal.province_id}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Kabupaten/Kota
              </p>
              <p className="text-sm">{proposal.regency_id}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Kelurahan
              </p>
              <p className="text-sm">{proposal.district}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Desa</p>
              <p className="text-sm">{proposal.village}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
