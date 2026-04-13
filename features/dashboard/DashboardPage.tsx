"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <Link href="/dashboard/program-priority-report">
        Laporan Prioritas Program
      </Link>
      <Link href="/dashboard/available-location">Lokasi Tersedia</Link>
    </div>
  );
}
