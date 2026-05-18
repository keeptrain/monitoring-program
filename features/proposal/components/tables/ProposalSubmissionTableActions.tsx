"use client";

import { UserRole } from "@/features/auth/types/user";
import { Check, PencilIcon, Plus, DownloadIcon, RotateCcw } from "lucide-react";
import { ProposalBioflocThematicProgram } from "../../types/proposal-biofloc";
import { MoreButton, MoreButtonMenuItem } from "@/components/shared/MoreButton";

export default function ProposalSubmissionTableActions({
  data,
  role,
  basePath,
  onAction,
}: {
  data: ProposalBioflocThematicProgram;
  role?: UserRole;
  basePath: string;
  onAction?: (
    data: ProposalBioflocThematicProgram,
    action: "verify" | "rollback" | "download",
  ) => void;
}) {
  const isPmo = role === "pmo";
  const isOfficer = role === "officer";
  const thematicType = basePath.includes("biofloc-thematic")
    ? "biofloc"
    : "minapadi";

  const menuItems: MoreButtonMenuItem[] = [];

  // Verifikasi hanya untuk PMO dan status pending
  if (data.status === "pending" && isPmo && onAction) {
    menuItems.push({
      type: "action",
      key: "verify",
      label: "Verifikasi",
      icon: Check,
      onClick: () => onAction(data, "verify"),
    });
  }

  // Perbaikan hanya untuk Officer dan status rejected atau revision
  if ((data.status === "rejected" || data.status === "revision") && isOfficer) {
    menuItems.push({
      type: "link",
      key: "revision",
      label: "Perbaiki",
      icon: PencilIcon,
      href: `${basePath}/proposal/${data.id}/revision`,
    });
  }

  // Potensial (Convert) hanya untuk PMO dan status approved
  if (data.status === "approved" && isPmo) {
    menuItems.push({
      type: "link",
      key: "convert",
      label: "Potensial",
      icon: Plus,
      href: `/dashboard/thematic/${thematicType}/create?proposalId=${data.id}`,
    });
  }

  // Kembalikan ke Pending (Rollback) hanya untuk PMO dan status approved/rejected
  if (
    (data.status === "approved" || data.status === "rejected") &&
    isPmo &&
    onAction
  ) {
    menuItems.push({
      type: "action",
      key: "rollback",
      label: "Kembalikan ke Pending",
      icon: RotateCcw,
      onClick: () => {
        const confirm = window.confirm(
          `Apakah Anda yakin ingin membatalkan verifikasi untuk kelompok "${data.kdmp_entities.name}"? Status proposal ini akan dikembalikan ke pending.`,
        );
        if (confirm) {
          onAction(data, "rollback");
        }
      },
    });
  }

  if (onAction) {
    menuItems.push({
      type: "action",
      key: "download",
      label: "Unduh Proposal",
      icon: DownloadIcon,
      onClick: () => onAction(data, "download"),
    });
  }

  return <MoreButton menuItems={menuItems} />;
}
