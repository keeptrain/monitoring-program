import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function FormSkeleton() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Header Skeleton */}
      <div className="mb-6 space-y-1">
        <Skeleton className="mb-1 h-4 w-48" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>

      <div className="space-y-6 pb-10">
        {/* Basic Info Card Skeleton */}
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-2 h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Button Skeleton */}
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
