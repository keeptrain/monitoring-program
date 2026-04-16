import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function IsfProgramPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
            Dashboard / Isf
          </p>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            Program Isf
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Kelola dan pantau program KDMP isf DJPB.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/dashboard/isf/create">
            <PlusIcon className="mr-1.5 size-3.5" />
            isf Program
          </Link>
        </Button>
      </div>
    </div>
  );
}
