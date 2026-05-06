import { Skeleton } from "@/components/ui/skeleton";

export function RevitalizationDashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Skeleton Header */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Skeleton List Area */}
      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-background border-border flex items-center justify-between border p-5"
          >
            <div className="flex items-center gap-6">
              <Skeleton className="size-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="hidden flex-col items-end gap-2 sm:flex">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-2 w-35" />
              </div>
              <Skeleton className="size-10 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
