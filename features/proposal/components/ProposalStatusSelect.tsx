import React from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

const PROPOSAL_STATUS_OPTIONS = [
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Disetujui" },
  { value: "converted", label: "Masuk KDMP" },
  { value: "rejected", label: "Ditolak" },
  { value: "revision", label: "Revisi" },
] as const;

interface ProposalStatusSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  allLabel?: string;
}

export function ProposalStatusSelect({
  value,
  onChange,
  className,
  allLabel = "Semua Status",
}: ProposalStatusSelectProps) {
  return (
    <NativeSelect value={value} onChange={onChange} className={className}>
      <NativeSelectOption value="">{allLabel}</NativeSelectOption>
      {PROPOSAL_STATUS_OPTIONS.map((option) => (
        <NativeSelectOption key={option.value} value={option.value}>
          {option.label}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}
