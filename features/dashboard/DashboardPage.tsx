"use client";

import Link from "next/link";
import DashboardNavbar, { dashboardLinks } from "@/components/DashboardNavbar";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar />

      <main className="flex-1 bg-muted/20 px-6 xs:px-0 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-10">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Admin Panel
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Kelola data program prioritas dan lokasi pelaksanaan.
            </p>
          </div>

          {/* Quick-access cards */}
          <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
            {dashboardLinks.map(({ href, label, icon: Icon, description }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col justify-between gap-6 bg-background p-8 transition-colors hover:bg-muted/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center border border-border transition-colors group-hover:border-foreground">
                    <Icon className="size-5 text-foreground" />
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    {label}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
