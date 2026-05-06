import { Skeleton } from "@/components/ui/skeleton";

export function MonitoringSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-12">
      {/* Top Section: Map & Stats */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Map Skeleton */}
        <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-lg">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Right Stats Skeleton */}
        <div className="flex w-full flex-col items-center gap-8 md:w-fit">
          <div className="w-full space-y-6">
            <Skeleton className="mx-auto h-4 w-32" />
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <Skeleton className="h-3 w-20" />
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-3 w-20" />
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
          <Skeleton className="aspect-4/3 w-84" />
        </div>
      </div>

      {/* Bottom Section: Charts */}
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div className="flex flex-col items-center space-y-8">
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex flex-col items-center space-y-8">
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  );
}
