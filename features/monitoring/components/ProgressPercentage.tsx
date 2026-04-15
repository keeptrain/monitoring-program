import { Progress } from "@/components/ui/progress";

export function ProgressPercentage({ value }: { value: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Progress value={value} className="h-3 flex-1" />
      <span className="font-bold tabular-nums">{value}%</span>
    </div>
  );
}
