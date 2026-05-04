import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ThematicListSkeleton() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="space-y-4">
        <div className="border-border space-y-4 border p-4">
          <Skeleton className="h-10 w-full" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ThematicDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-full max-w-[300px]" />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="col-span-2 flex items-end justify-between">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>

        {/* Kusuka Information */}
        <div className="col-span-2 md:col-span-1">
          <Card>
            <CardContent className="flex flex-col divide-y p-0">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <div className="col-span-2 md:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-4 w-12" />
            </CardContent>
          </Card>
        </div>

        {/* Information Detail */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cycle Data */}
        <div className="col-span-2 md:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* S-Curve */}
        <div className="col-span-2 md:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-video w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Documentation & Map */}
        <div className="col-span-2 space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="aspect-video w-full rounded-lg" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-[320px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ThematicFormSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
