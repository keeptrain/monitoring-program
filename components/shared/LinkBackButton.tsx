import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LinkBackButton({ href }: { href: string }) {
  return (
    <Button variant="ghost" size="icon-xs" asChild className="shrink-0">
      <Link href={href}>
        <ArrowLeft className="size-4" />
      </Link>
    </Button>
  );
}
