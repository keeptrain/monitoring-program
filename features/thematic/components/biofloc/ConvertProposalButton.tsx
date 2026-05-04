"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ConvertProposalButtonProps {
  proposalId: string;
  proposalName: string;
}

export function ConvertProposalButton({
  proposalId,
  proposalName,
}: ConvertProposalButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to create form with proposal data in query params
    router.push(`/dashboard/thematic/biofloc/create?proposalId=${proposalId}`);
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="sm"
      className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
      title={`Konversi proposal "${proposalName}" ke Program Tematik`}
    >
      <Plus className="size-4" />
      Potensial
    </Button>
  );
}
