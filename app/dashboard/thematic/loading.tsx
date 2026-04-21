import { Skeleton } from "@/components/ui/skeleton";

export default function ThematicLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Stats/Metrics Skeleton (Optional if you have cards) */}

      {/* Table Skeleton */}
      <div className="border-border bg-background border p-4">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-4">
          {/* Table Header */}
          <div className="flex gap-4 border-b pb-4">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          {/* Table Rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <Skeleton className="h-5 flex-1" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-16" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
