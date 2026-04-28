import { cn } from "@/lib/utils";

interface ThematicFormHeaderProps {
  isEdit?: boolean;
  className?: string;
}

export function ThematicFormHeader({
  isEdit,
  className,
}: ThematicFormHeaderProps) {
  return (
    <div className={cn("mb-6 space-y-1", className)}>
      <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
        Dashboard / Tematik / {isEdit ? "Ubah" : "Buat"}
      </p>
      <h2 className="text-foreground text-2xl font-semibold tracking-tight">
        {isEdit ? "Ubah KDMP" : "Tambah KDMP Baru"}
      </h2>
      <p className="text-muted-foreground text-sm">
        Silahkan isi informasi KDMP di bawah ini
      </p>
    </div>
  );
}
