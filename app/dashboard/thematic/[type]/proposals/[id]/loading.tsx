import { Skeleton } from "@/components/ui/skeleton";

export default function ProposalDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-3 w-48" /> {/* Breadcrumbs */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10" /> {/* Back Button */}
            <Skeleton className="h-8 w-64" /> {/* Title */}
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-4 w-32" /> {/* Province */}
          </div>
        </div>
      </div>

      {/* Meta Info Rows */}
      <div className="flex items-center justify-between border-y border-zinc-100 py-4">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-6 w-24" /> {/* Status Badge */}
      </div>

      {/* Information Card Skeleton */}
      <div className="space-y-4 border border-zinc-200 bg-white p-6">
        <Skeleton className="h-6 w-32" /> {/* Card Title */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
      </div>

      {/* Map Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-96 w-full" /> {/* Large Map Area */}
      </div>
    </div>
  );
}
