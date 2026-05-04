"use client";

import { useEffect, useRef } from "react";
import { useProposalStore } from "@/features/proposal/api/proposal-store";
import ProposalThematicPage from "@/features/proposal/ProposalThematicPage";
import { ProposalBioflocDetail } from "../types/proposal-biofloc";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProposalEditClientProps {
  proposalId: string;
  initialData: ProposalBioflocDetail & {
    rejection_reason?: string | null;
    admin_notes?: string | null;
  };
  searchParams: Promise<{ step?: string }>;
}

export default function ProposalEditClient({
  proposalId,
  initialData,
  searchParams,
}: ProposalEditClientProps) {
  const { setStep1Data, setStep2Data } = useProposalStore();
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const entity = initialData.kdmp_entities;
    const loc =
      initialData.available_locations as typeof initialData.available_locations & {
        province_code?: string;
        regency_code?: string;
        district_code?: string;
        village_code?: string;
      };

    if (entity) {
      setStep1Data({
        name: entity.name ?? "",
        nib: entity.nib ?? "",
        kusukaNumber: entity.kusuka_number ?? "",
        legalEntityNumber: entity.legal_entity_number ?? "",
        chairmanName: entity.chairman_name ?? "",
        chairmanPhoneNumber: entity.chairman_phone ?? "",
        // companion fields not in detail type — leave empty
        companionName: "",
        companionPhoneNumber: "",
        boardMemberCount: entity.board_member_count ?? 0,
        memberCount: entity.member_count ?? 0,
      });
    }

    //   if (loc) {
    //     setStep2Data({
    //       latitude: loc.latitude?.toString() ?? "",
    //       longitude: loc.longitude?.toString() ?? "",
    //       landSlope: loc.,
    //       province_code: loc.province_code ?? "",
    //       regency_code: loc.regency_code ?? "",
    //       district_code: loc.district_code ?? "",
    //       village_code: loc.village_code ?? "",
    //     });
    //   }
  }, [initialData, setStep1Data, setStep2Data]);

  return (
    <div className="space-y-4">
      {/* {initialData.rejection_reason && (
        <Alert variant="destructive">
          <AlertTriangleIcon className="size-4" />
          <AlertTitle>
            {initialData.status === "rejected"
              ? "Alasan Penolakan"
              : "Catatan Revisi"}
          </AlertTitle>
          <AlertDescription className="mt-1 space-y-1">
            <p>{initialData.rejection_reason}</p>
            {initialData.admin_notes && (
              <p className="text-muted-foreground text-sm">
                Catatan admin: {initialData.admin_notes}
              </p>
            )}
          </AlertDescription>
        </Alert>
      )} */}
      {/* <ProposalThematicPage
        searchParams={searchParams}
        cancelHref={`/biofloc-thematic/${proposalId}`}
      /> */}
    </div>
  );
}
