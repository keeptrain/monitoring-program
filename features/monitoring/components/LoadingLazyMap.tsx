import { Skeleton } from "@/components/ui/skeleton";

export const LoadingLazyMap = () => {
  return (
    <div className="bg-muted/10 absolute inset-0 z-0">
      <Skeleton className="h-full w-full rounded-none" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="flex space-x-1.5">
          <div className="bg-foreground/30 size-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" />
          <div className="bg-foreground/30 size-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" />
          <div className="bg-foreground/30 size-1.5 animate-bounce rounded-full" />
        </div>
        <span className="text-muted-foreground/50 text-[10px] font-bold tracking-[0.3em] uppercase">
          Sistem Navigasi Memuat
        </span>
      </div>
    </div>
  );
};
