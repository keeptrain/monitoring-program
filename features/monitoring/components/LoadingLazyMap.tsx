import { Skeleton } from "@/components/ui/skeleton";

export const LoadingLazyMap = () => {
  return (
    <div className="absolute inset-0 z-0 bg-muted/10">
      <Skeleton className="h-full w-full rounded-none" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="flex space-x-1.5">
          <div className="size-1.5 animate-bounce rounded-full bg-foreground/30 [animation-delay:-0.3s]" />
          <div className="size-1.5 animate-bounce rounded-full bg-foreground/30 [animation-delay:-0.15s]" />
          <div className="size-1.5 animate-bounce rounded-full bg-foreground/30" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50">
          Sistem Navigasi Memuat
        </span>
      </div>
    </div>
  );
};
