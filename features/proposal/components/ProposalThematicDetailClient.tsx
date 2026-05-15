"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon, MapPinIcon } from "lucide-react";
import { formatDateWithTime } from "@/lib/utils";
import { StatusBadge } from "@/features/proposal/components/tables/ProposalSubmissionTableColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailItem } from "@/components/shared/DetailItem";
import { ProposalBioflocDetail } from "@/features/proposal/types/proposal-biofloc";
import ProposalDetailClient from "../../thematic/components/biofloc/ProposalDetailClient";
import { useGetProposalThematic } from "@/features/thematic/api/getProposalThematic";
import { ProposalDownloadButton } from "./tables/ProposalDownloadButton";
import { Button } from "@/components/ui/button";
import {
  THEMATIC_CONFIG,
  ThematicProgramType,
} from "@/features/thematic/constants/thematic-constants";

export function ProposalThematicDetailClient({
  id,
  programType,
}: {
  id: string;
  programType: string;
}) {
  const router = useRouter();
  const config = THEMATIC_CONFIG[programType as ThematicProgramType];
  const groupLabel = config?.groupLabel || "Kelompok";

  const { data } = useGetProposalThematic(id);

  const {
    id: proposalId,
    status,
    created_at,
    updated_at,
    available_locations,
    kdmp_entities,
    land_slope,
    has_land_preparation_letter,
    proposed_commodity,
    has_experienced_member,
    commodity_potentials,
    other_commodity_potential,
    fiscal_year,
    rejection_reason,
  } = data?.data as ProposalBioflocDetail;

  const locationParts = [
    available_locations?.ref_provinces?.name,
    available_locations?.ref_regencies?.name,
    available_locations.ref_districts?.name,
    available_locations?.ref_villages?.name,
  ].filter(Boolean);

  const fullLocation =
    locationParts.length > 0 ? locationParts.join(", ") : "-";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col">
        <Button onClick={router.back} variant="link" className="w-fit px-0">
          <ArrowLeftIcon className="size-4" />
          Kembali
        </Button>
        <h1 className="text-foreground mt-2 text-lg font-semibold tracking-tight md:text-xl">
          {kdmp_entities?.name ?? "-"}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-2">
            <MapPinIcon className="size-4" />
            <p className="text-muted-foreground">{fullLocation}</p>
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Proposal</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DetailItem label="Status" value={<StatusBadge status={status} />} />
          <DetailItem
            label="Tahun Anggaran"
            value={fiscal_year?.toString() ?? "-"}
          />
          <DetailItem label="Dibuat" value={formatDateWithTime(created_at)} />
          <DetailItem
            label="Diperbarui"
            value={formatDateWithTime(updated_at)}
          />
          {rejection_reason && (
            <div className="col-span-2 rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-medium text-red-800">
                Alasan Penolakan:
              </p>
              <p className="text-sm text-red-700">{rejection_reason}</p>
            </div>
          )}
          <DetailItem
            label="Dokumen Proposal"
            value={
              <div className="flex items-center gap-2">
                <p>Download</p>
                <ProposalDownloadButton id={id} />
              </div>
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Identitas {groupLabel}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DetailItem
            label={`Nama ${groupLabel}`}
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

      <Card>
        <CardHeader>
          <CardTitle>Detail Program</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DetailItem
            label="Kemiringan Lahan"
            value={land_slope ? `${land_slope}°` : "-"}
          />
          <DetailItem
            label="Surat Persiapan Lahan"
            value={has_land_preparation_letter ? "Ada" : "Tidak Ada"}
          />
          <DetailItem
            label="Komoditas yang Diajukan"
            className="capitalize"
            value={proposed_commodity ?? "-"}
          />
          <DetailItem
            label="Pengalaman Anggota"
            value={has_experienced_member ? "Ada" : "Tidak Ada"}
          />
          <DetailItem
            label="Potensi Komoditas"
            className="capitalize"
            value={commodity_potentials?.join(", ") || "-"}
          />
          {other_commodity_potential && (
            <DetailItem
              label="Potensi Komoditas Lainnya"
              className="capitalize"
              value={other_commodity_potential}
            />
          )}
        </CardContent>
      </Card>

      <ProposalDetailClient
        id={proposalId}
        programType={programType}
        locations={{
          latitude: available_locations?.latitude || 0,
          longitude: available_locations?.longitude || 0,
        }}
      />
    </div>
  );
}
