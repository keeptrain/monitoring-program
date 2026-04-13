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
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground"
        >
          <span className="flex size-8 items-center justify-center bg-primary text-background text-[10px] font-bold rounded-full">
            <FishIcon className="size-4" />
          </span>
          <span className="hidden sm:inline text-xs">
            Kementerian Kelautan <br /> dan Perikanan
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

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
