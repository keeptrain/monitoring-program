"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FishIcon, LayoutDashboard, Map } from "lucide-react";

const navLinks = [
  { href: "/#programs", label: "Program" },
  { href: "/#features", label: "Fitur" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-border bg-background/90 sticky top-0 z-50 border-b backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-foreground flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="bg-primary text-background flex size-8 items-center justify-center rounded-full text-[10px] font-bold">
            <FishIcon className="size-4" />
          </span>
          <span className="hidden text-xs sm:inline">
            Kementerian Kelautan <br /> dan Perikanan
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/monitoring">
              <Map className="mr-1.5 size-3.5" />
              Monitoring
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard">
              <LayoutDashboard className="mr-1.5 size-3.5" />
              Dashboard
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
