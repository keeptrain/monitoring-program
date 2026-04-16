"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  MapPin,
  ArrowLeft,
  LeafIcon,
  WavesIcon,
} from "lucide-react";

const dashboardLinks = [
  {
    href: "/dashboard/available-location",
    label: "Lokasi Tersedia",
    icon: MapPin,
    description: "Kelola data lokasi yang tersedia untuk program",
  },
  {
    href: "/dashboard/thematic",
    label: "Program Tematik",
    icon: LeafIcon,
    description: "Kelola program tematik DJPB",
  },
  {
    href: "/dashboard/isf",
    label: "Program Isf",
    icon: WavesIcon,
    description: "Kelola program isf DJPB",
  },
];

export default function DashboardNavbar() {
  return (
    <header className="border-border text-background sticky top-0 z-50 border-b bg-cyan-800">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-background/60 hover:text-background flex items-center gap-1.5 text-xs transition-colors"
          >
            <ArrowLeft className="size-3" />
            <span className="hidden sm:block">Beranda</span>
          </Link>
          <div className="bg-background/20 h-4 w-px" />
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-background size-4" />
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
