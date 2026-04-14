import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-8 w-[350px]" />
        <Skeleton className="h-4 w-[450px]" />
      </div>

      {/* Form Sections Skeleton */}
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Skeleton className="h-10 w-full" />
    </div>
  );
}
