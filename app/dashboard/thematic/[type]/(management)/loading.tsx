import { Skeleton } from "@/components/ui/skeleton";

export default function ThematicManagementLoading() {
  return (
    <div className="mx-auto max-w-6xl">
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
