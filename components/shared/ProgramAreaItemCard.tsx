import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { cn, formatDateWithTime } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export interface ProgramAreaItemCardProps {
  href: string;
  badgeLabel: string;
  badgeNumber: number | string;
  badgeColorClass: string;
  title: string;
  subtitle?: string;
  lastUpdatedAt?: string | null;
  progressPercent?: number;
}

export default function ProgramAreaItemCard({
  href,
  badgeLabel,
  badgeNumber,
  badgeColorClass,
  title,
  subtitle,
  lastUpdatedAt,
  progressPercent = 0,
}: ProgramAreaItemCardProps) {
  return (
    <Link
      href={href}
      className="bg-background border-border group hover:bg-muted/30 focus-visible:ring-primary relative flex items-center justify-between border p-5 transition-all outline-none focus-visible:ring-2"
    >
      <div className="flex items-center gap-6">
        {/* Badge Circle */}
        <div
          className={cn(
            "flex size-12 shrink-0 flex-col items-center justify-center rounded-full text-white shadow-[4px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
            badgeColorClass,
          )}
        >
          <span className="text-[10px] leading-none font-bold uppercase opacity-90">
            {badgeLabel}
          </span>
          <span className="text-lg leading-none font-bold italic">
            {badgeNumber}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="text-foreground group-hover:text-primary font-semibold transition-colors">
            {title}
          </h3>
          {subtitle ? (
            <p className="text-muted-foreground text-xs">{subtitle}</p>
          ) : (
            <div className="flex items-center gap-2">
              <span className="bg-muted text-muted-foreground px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                Terakhir diperbarui
              </span>
              <span className="text-muted-foreground text-xs font-medium italic">
                {lastUpdatedAt ? formatDateWithTime(lastUpdatedAt) : "-"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Progress */}
        <div className="hidden flex-col items-end gap-2 sm:flex">
          <div className="flex items-center gap-3">
            <p className="text-primary text-xl leading-none font-black whitespace-nowrap italic">
              {Math.round(progressPercent)}%
            </p>
          </div>
          <Progress value={progressPercent} className="h-2 w-35" />
        </div>

        {/* Action Arrow */}
        <div className="flex size-10 items-center justify-center rounded-full border-2 border-zinc-200 transition-colors group-hover:border-zinc-300">
          <ArrowRightIcon className="size-4" />
        </div>
      </div>
    </Link>
  );
}
