"use client";

import { useQuery } from "@tanstack/react-query";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { getDistricts } from "@/lib/services/wilayah-service";

interface DistrictSelectProps {
  regencyCode: string;
  value: string;
  onChange: (value: string, name?: string) => void;
  className?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
}

const getDistrictQueryKey = (regencyCode: string) => ["districts", regencyCode];

export default function DistrictSelect({
  regencyCode,
  value,
  onChange,
  className = "w-full",
  disabled,
  "aria-invalid": ariaInvalid,
}: DistrictSelectProps) {
  const { data: options = [], isLoading: loading } = useQuery({
    queryKey: getDistrictQueryKey(regencyCode),
    queryFn: () => getDistricts(regencyCode),
    enabled: !!regencyCode,
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
      disabled={disabled || loading || !regencyCode}
      aria-invalid={ariaInvalid}
    >
      <NativeSelectOption value="">
        {loading ? "Memuat..." : "Pilih Kecamatan"}
      </NativeSelectOption>
      {options.map((opt) => (
        <NativeSelectOption key={opt.code} value={opt.code}>
          {opt.name}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}
