import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Header Skeleton */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* List Skeleton */}
      <div className="grid gap-4">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="border-border flex items-center justify-between border p-5"
          >
            <div className="flex items-center gap-6">
              {/* Circle Skeleton */}
              <Skeleton className="size-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="hidden space-y-2 sm:flex sm:flex-col sm:items-end">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-2 w-24" />
              </div>
              <Skeleton className="size-10 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
