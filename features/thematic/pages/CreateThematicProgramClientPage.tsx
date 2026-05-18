"use client";

import { useMemo } from "react";
import { useGetProposalThematic } from "../api/getProposalThematic";
import { ProposalBioflocDetail } from "@/features/proposal/types/proposal-biofloc";
import { Loader2 } from "lucide-react";
import ThematicProgramForm from "../forms/ThematicProgramForm";
import { useThematicProgramForm } from "../hooks/useThematicProgramForm";
import { ThematicProgramFormValues } from "../forms/thematic-program-schema";
import {
  THEMATIC_CONFIG,
  ThematicProgramType,
} from "../constants/thematic-constants";

export default function CreateThematicProgramClientPage({
  proposalId,
  thematicType,
}: {
  proposalId: string;
  thematicType: ThematicProgramType;
}) {
  const config = THEMATIC_CONFIG[thematicType];

  const { data: result, isLoading } = useGetProposalThematic(proposalId);

  const proposal = result?.data as ProposalBioflocDetail | undefined;

  // Map proposal to thematic program form values
  const initialData = useMemo<ThematicProgramFormValues>(
    () => ({
      progress_percent: 0,
      commodity_aid: proposal?.proposed_commodity || "",
      commodity_potential: proposal?.commodity_potentials?.join(", ") || "",
      land_area: "",
      production_value: "",
      total_management: proposal?.kdmp_entities.board_member_count || 0,
      total_members: proposal?.kdmp_entities.member_count || 0,
      distribution_amount: 0,
      sppg_partner: "",
      s_curve_path: "",
    }),
    [proposal],
  );

  const { form, onSubmit, isPending } = useThematicProgramForm(
    initialData,
    proposalId,
    true,
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-muted-foreground size-8 animate-spin" />
      </div>
    );
  }

  return (
    <ThematicProgramForm
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      isEdit={false}
      documentationsStorageBasePath={config.storagePath}
    />
  );
}
