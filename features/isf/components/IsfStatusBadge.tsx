import { Badge } from "@/components/ui/badge";

const STATUS_VARIANT: Record<
  string,
  {
    variant: "default" | "outline" | "secondary";
    label: string;
    textColor: string;
  }
> = {
  baru: {
    variant: "outline",
    label: "Baru",
    textColor: "text-blue-600 border-blue-200 bg-blue-50/50",
  },
  sedang_berjalan: {
    variant: "outline",
    label: "Sedang Berjalan",
    textColor: "text-amber-600 border-amber-200 bg-amber-50/50",
  },
  selesai: {
    variant: "default",
    label: "Selesai",
    textColor: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
};

const DEFAULT_CONFIG = {
  variant: "secondary" as const,
  label: "Unknown",
  textColor: "text-muted-foreground",
};

export default function IsfStatusBadge({ status }: { status: string }) {
  // Normalize string: lowercase and replace spaces with underscore for matching
  const normalizedStatus = (status || "").toLowerCase().replace(/\s+/g, "_");
  const config = STATUS_VARIANT[normalizedStatus] || {
    ...DEFAULT_CONFIG,
    label: status, // Show the original status string if not found in map
  };

  return (
    <Badge
      variant={config.variant}
      className={`${config.textColor} text-[10px] font-bold tracking-wider uppercase`}
    >
      {config.label}
    </Badge>
  );
}
