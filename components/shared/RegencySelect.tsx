"use client";

import { useQuery } from "@tanstack/react-query";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { getRegencies } from "@/lib/services/wilayah-service";

interface RegencySelectProps {
  provinceCode: string;
  value: string;
  onChange: (value: string, name?: string) => void;
  className?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
}

const getRegencyQueryKey = (provinceCode: string) => [
  "regencies",
  provinceCode,
];

export default function RegencySelect({
  provinceCode,
  value,
  onChange,
  className = "w-full",
  disabled,
  "aria-invalid": ariaInvalid,
}: RegencySelectProps) {
  const { data: options = [], isLoading: loading } = useQuery({
    queryKey: getRegencyQueryKey(provinceCode),
    queryFn: () => getRegencies(provinceCode),
    enabled: !!provinceCode,
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
      disabled={disabled || loading || !provinceCode}
      aria-invalid={ariaInvalid}
    >
      <NativeSelectOption value="">
        {loading ? "Memuat..." : "Pilih Kabupaten/Kota"}
      </NativeSelectOption>
      {options.map((opt) => (
        <NativeSelectOption key={opt.code} value={opt.code}>
          {opt.name}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}
