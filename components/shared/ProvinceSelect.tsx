import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { PROVINCES_BY_ISLAND } from "@/features/thematic/constants/indonesia-provinces";

interface ProvinceSelectProps {
  /** Current selected province ID (or "" for all) */
  value: string;
  onChange: (value: string, name?: string) => void;
  /** Label for the "all" option, defaults to "Semua Provinsi" */
  allLabel?: string;
  /** Show the "all" option at the top, defaults to true */
  showAll?: boolean;
  className?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
}

export default function ProvinceSelect({
  value,
  onChange,
  allLabel = "Semua Provinsi",
  showAll = true,
  className = "w-[220px]",
  disabled,
  "aria-invalid": ariaInvalid,
}: ProvinceSelectProps) {
  return (
    <NativeSelect
      value={value}
      onChange={(e) => {
        const val = e.target.value;
        if (!val) {
          onChange(val, "");
          return;
        }
        for (const group of PROVINCES_BY_ISLAND) {
          const found = group.provinces.find((p) => p.province_id === val);
          if (found) {
            onChange(val, found.name);
            return;
          }
        }
        onChange(val);
      }}
      className={className}
      disabled={disabled}
      aria-invalid={ariaInvalid}
    >
      {showAll && <NativeSelectOption value="">{allLabel}</NativeSelectOption>}
      {PROVINCES_BY_ISLAND.map(({ island, provinces }) => {
        return (
          <NativeSelectOptGroup key={island} label={island}>
            {provinces.map((p) => (
              <NativeSelectOption key={p.province_id} value={p.province_id}>
                {p.name}
              </NativeSelectOption>
            ))}
          </NativeSelectOptGroup>
        );
      })}
    </NativeSelect>
  );
}
