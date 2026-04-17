import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { cn, formatDateWithTime } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { STEP_COLORS } from "./constants/isf-step";
import { IsfStepSummary } from "./types/isf";

export default function IsfProgramPage({ data }: { data: IsfStepSummary[] }) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
            Dashboard / Isf
          </p>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            Program ISF
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitoring Integrated Shrimp Farming (ISF).
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {data.map((program) => (
          <ProgramItemCard key={program.step_id} program={program} />
        ))}
      </div>
    </div>
  );
}

function ProgramItemCard({ program }: { program: IsfStepSummary }) {
  const currentProgress = program.progress_percent;
  const stepNumber = program.step_id;
  const stepColorClass = STEP_COLORS[stepNumber] || "bg-primary";

  return (
    <Link
      href={`/dashboard/isf/${program.step_id}`}
      className="bg-background border-border group hover:bg-muted/30 focus-visible:ring-primary relative flex items-center justify-between border p-5 transition-all outline-none focus-visible:ring-2"
    >
      <div className="flex items-center gap-6">
        {/* Step Number Circle */}
        <div
          className={cn(
            "flex size-12 shrink-0 flex-col items-center justify-center rounded-full text-white shadow-[4px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
            stepColorClass,
          )}
        >
          <span className="text-[10px] leading-none font-bold uppercase opacity-90">
            Zona
          </span>
          <span className="text-lg leading-none font-bold italic">
            {stepNumber}
          </span>
        </div>

        {/* Program Info */}
        <div className="space-y-1">
          <h3 className="text-foreground group-hover:text-primary font-semibold transition-colors">
            {program.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="bg-muted text-muted-foreground px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase">
              Terakhir diperbarui
            </span>
            <span className="text-muted-foreground text-xs font-medium italic">
              {program.updated_at
                ? formatDateWithTime(program.updated_at)
                : "-"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Progress Value */}
        <div className="hidden flex-col items-end gap-2 sm:flex">
          <div className="flex items-center gap-3">
            <p className="text-primary text-xl leading-none font-black whitespace-nowrap italic">
              {Math.round(currentProgress)}%
            </p>
          </div>
          <Progress value={currentProgress} className="h-2 w-35" />
        </div>

        {/* Action Button */}
        <Button
          size="icon"
          variant="outline"
          className="size-10 rounded-full border-2"
        >
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </Link>
  );
}
