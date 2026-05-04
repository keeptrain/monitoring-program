import { Skeleton } from "@/components/ui/skeleton";

export default function UsersLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="space-y-4">
        {/* Actions Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Table Skeleton Area */}
        <div className="border-border rounded-md border">
          <div className="bg-muted/20 border-b p-4">
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
