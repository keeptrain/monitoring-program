"use client";

import { useQuery } from "@tanstack/react-query";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { getVillages } from "@/lib/services/wilayah-service";

interface VillageSelectProps {
  districtCode: string;
  value: string;
  onChange: (value: string, name?: string) => void;
  className?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
}

const getVillageQueryKey = (districtCode: string) => ["villages", districtCode];

export default function VillageSelect({
  districtCode,
  value,
  onChange,
  className = "w-full",
  disabled,
  "aria-invalid": ariaInvalid,
}: VillageSelectProps) {
  const { data: options = [], isLoading: loading } = useQuery({
    queryKey: getVillageQueryKey(districtCode),
    queryFn: () => getVillages(districtCode),
    enabled: !!districtCode,
    staleTime: 1000 * 60 * 30, // 30 minutes cache
  });

  return (
    <NativeSelect
      value={value}
      onChange={(e) => {
        const val = e.target.value;
        const selected = options.find((o) => o.code === val);
        onChange(val, selected?.name);
      }}
      className={className}
      disabled={disabled || loading || !districtCode}
      aria-invalid={ariaInvalid}
    >
      <NativeSelectOption value="">
        {loading ? "Memuat..." : "Pilih Desa/Kelurahan"}
      </NativeSelectOption>
      {options.map((opt) => (
        <NativeSelectOption key={opt.code} value={opt.code}>
          {opt.name}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}
