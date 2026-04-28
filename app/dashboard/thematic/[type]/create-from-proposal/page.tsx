import { notFound } from "next/navigation";
import { getProposalBioflocDetail } from "@/features/thematic/actions/proposal-biofloc";
import BioflocProgramForm from "@/features/thematic/forms/BioflocProgramForm";
import { ThematicFormHeader } from "@/features/thematic/components/ThematicFormHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default async function CreateProgramFromProposalPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ proposalId?: string }>;
}) {
  const { type } = await params;
  const { proposalId } = await searchParams;

  // Validate type
  if (type !== "biofloc" && type !== "minapadi") {
    return notFound();
  }

  if (!proposalId) {
    return notFound();
  }

  const proposalIdNum = parseInt(proposalId);
  if (isNaN(proposalIdNum)) {
    return notFound();
  }

  let proposal;
  try {
    proposal = await getProposalBioflocDetail(proposalIdNum);
  } catch {
    return notFound();
  }

  // Check if proposal is approved
  if (proposal.status !== "approved") {
    return (
      <div className="mx-auto max-w-4xl py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-900">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-red-600" />
            <div>
              <p className="font-semibold">Gagal Mengkonversi Proposal</p>
              <p className="text-sm">
                Hanya proposal yang telah disetujui dapat dikonversi menjadi
                program tematik.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prepare initial data from proposal with default values for required fields
  const initialData = {
    id: 0, // New program
    name: proposal.name,
    location_id: proposal.location_id || 0,
    commodity_aid: "Bioflok",
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
  } as any;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <ThematicFormHeader />
      {/* Info Alert */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
          <div>
            <p className="font-semibold">
              Konversi Proposal ke Program Tematik
            </p>
            <p className="text-sm">
              Formulir di bawah sudah dipra-isi dengan data dari proposal "
              {proposal.name}". Silahkan sesuaikan dan isi data lainnya yang
              diperlukan sebelum menyimpan.
            </p>
          </div>
        </div>
      </div>

      {/* Proposal Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg">Informasi Sumber Proposal</CardTitle>
          <CardDescription>Data dari proposal yang dikonversi</CardDescription>
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
              <p className="text-sm font-semibold text-green-600">Disetujui</p>
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

      {/* Form */}
      <BioflocProgramForm 
        initialData={initialData} 
        proposalId={proposalIdNum}
        isConvertingFromProposal={true}
      />
    </div>
  );
}
