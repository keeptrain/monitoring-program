import React from "react";
import { LucideIcon } from "lucide-react";

interface DetailItemProps {
  icon?: LucideIcon;
  label: string;
  value: string | number | null | undefined | React.ReactNode;
  className?: string;
}

/**
 * A shared component to display a metadata field with an icon, label, and value.
 * Consistent across dashboard and detail pages.
 */
export function DetailItem({
  icon: Icon,
  label,
  value,
  className,
}: DetailItemProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className || ""}`}>
      <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
        {Icon && <Icon className="size-4" />}
        {label}
      </div>
      <div className="text-foreground text-sm font-semibold">
        {value === undefined || value === null || value === "" ? "-" : value}
      </div>
    </div>
  );
}
