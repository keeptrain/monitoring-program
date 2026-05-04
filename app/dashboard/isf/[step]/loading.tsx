import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Header Skeleton */}
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-background border-border rounded-md border">
        {/* Table Header */}
        <div className="border-border grid grid-cols-4 items-center gap-4 border-b p-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="ml-auto h-4 w-8" />
        </div>

        {/* Table Body Rows */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="border-border grid grid-cols-4 items-center gap-4 border-b p-4 last:border-0"
          >
            <Skeleton className="h-5 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-20 rounded-full" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="ml-auto size-8 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
