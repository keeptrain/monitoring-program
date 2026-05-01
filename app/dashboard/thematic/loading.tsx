import { Skeleton } from "@/components/ui/skeleton";

export default function ThematicLoading() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Header Skeleton */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-4 w-40" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Navigation Tabs Skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Table Skeleton (Broad strokes) */}
      <div className="space-y-4">
        {/* Filter Mock */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-100" />
          </div>
          <Skeleton className="h-9 w-64" />
        </div>

        {/* Table Mock */}
        <div className="border border-zinc-200 bg-white">
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
