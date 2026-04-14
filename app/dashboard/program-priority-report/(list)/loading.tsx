import { TableSkeleton } from "@/components/datatable/TableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Header Skeleton */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-full max-w-[450px]" />
        </div>
        <Skeleton className="h-9 w-[130px]" />
      </div>

      {/* Table Skeleton */}
      <TableSkeleton columnCount={5} />
    </div>
  );
}
