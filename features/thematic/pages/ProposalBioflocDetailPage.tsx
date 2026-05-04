import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { MapPinIcon } from "lucide-react";
import { getProposalBioflocDetail } from "../actions/proposal-biofloc";
import { proposalBioflocDetailQueryKey } from "../api/getProposalBioflocDetail";
import { formatDateWithTime } from "@/lib/utils";
import { StatusBadge } from "@/features/proposal/components/tables/ProposalSubmissionTableColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailItem } from "@/components/shared/DetailItem";
import ProposalDetailClient from "../components/biofloc/ProposalDetailClient";
import { notFound } from "next/navigation";

import { ProposalBioflocDetail } from "@/features/proposal/types/proposal-biofloc";

export default async function ProposalBioflocDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;

  if (type !== "biofloc") {
    notFound();
  }

  const queryClient = new QueryClient();
  const data = (await queryClient.fetchQuery({
    queryKey: proposalBioflocDetailQueryKey(id),
    queryFn: () => getProposalBioflocDetail(id),
  })) as ProposalBioflocDetail | null;

  if (!data) {
    notFound();
  }

  const {
    id: proposalId,
    status,
    created_at,
    updated_at,
    available_locations,
    kdmp_entities,
  } = data;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
            Dashboard / Tematik / {type} / Proposal / Detail
          </p>
          <h1 className="text-foreground text-lg font-semibold tracking-tight md:text-xl">
            {kdmp_entities?.name ?? "-"}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-2">
              <MapPinIcon className="size-4" />
              <p className="text-muted-foreground">
                {available_locations?.province_name || "-"}
              </p>
            </span>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informasi Proposal</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <DetailItem label="Status" value={<StatusBadge status={status} />} />
          <DetailItem label="Dibuat" value={formatDateWithTime(created_at)} />
          <DetailItem
            label="Diperbarui"
            value={formatDateWithTime(updated_at)}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Identitas KDMP</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DetailItem
            label="Nama Kelompok"
            value={kdmp_entities?.name ?? "-"}
          />
          <DetailItem
            label="Nomor KUSUKA"
            value={kdmp_entities?.kusuka_number ?? "-"}
          />
          <DetailItem label="NIB" value={kdmp_entities?.nib ?? "-"} />
          <DetailItem
            label="Badan Hukum"
            value={kdmp_entities?.legal_entity_number ?? "-"}
          />
          <DetailItem
            label="Ketua"
            value={kdmp_entities?.chairman_name ?? "-"}
          />
          <DetailItem
            label="No. Telp Ketua"
            value={kdmp_entities?.chairman_phone ?? "-"}
          />
          <DetailItem
            label="Jumlah Pengurus"
            value={kdmp_entities?.board_member_count?.toString() ?? "-"}
          />
          <DetailItem
            label="Jumlah Anggota"
            value={kdmp_entities?.member_count?.toString() ?? "-"}
          />
        </CardContent>
      </Card>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProposalDetailClient
          id={proposalId}
          locations={{
            latitude: available_locations?.latitude || 0,
            longitude: available_locations?.longitude || 0,
          }}
        />
      </HydrationBoundary>
    </div>
  );
}
