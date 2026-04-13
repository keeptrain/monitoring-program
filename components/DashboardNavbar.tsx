"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  MapPin,
  FileBarChart2,
  ArrowLeft,
} from "lucide-react";

const dashboardLinks = [
  {
    href: "/dashboard/available-location",
    label: "Lokasi Tersedia",
    icon: MapPin,
    description: "Kelola data lokasi yang tersedia untuk program",
  },
  {
    href: "/dashboard/program-priority-report",
    label: "Laporan Prioritas",
    icon: FileBarChart2,
    description: "Kelola laporan program prioritas DJPB",
  },
];

export default function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-primary/90 text-background">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-background/60 transition-colors hover:text-background"
          >
            <ArrowLeft className="size-3" />
            Beranda
          </Link>
          <div className="h-4 w-px bg-background/20" />
          <div className="flex items-center gap-2">
            <LayoutDashboard className="size-4 text-background" />
            <span className="text-sm font-semibold tracking-tight">
              Dashboard Admin
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}

export { dashboardLinks };
