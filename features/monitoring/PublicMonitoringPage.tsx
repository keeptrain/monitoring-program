"use client";

import Navbar from "@/components/Navbar";
import { Map, Layers, Navigation2 } from "lucide-react";

export default function PublicMonitoringPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col">
        {/* Page header */}
        <div className="border-b border-border bg-background px-6 py-8">
          <div className="mx-auto max-w-6xl">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Monitoring Publik
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Peta Sebaran Program Prioritas
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Visualisasi geografis lokasi pelaksanaan program di seluruh
              wilayah Indonesia.
            </p>
          </div>
        </div>

        {/* Map area */}
        <div className="relative flex flex-1 bg-muted/30">
          {/* Sidebar controls (placeholder) */}
          <aside className="hidden w-64 shrink-0 border-r border-border bg-background p-4 lg:flex lg:flex-col lg:gap-4">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Filter Layer
            </p>
            {["Perikanan Tangkap", "Pelabuhan", "Budidaya", "Pengawasan"].map(
              (layer) => (
                <label
                  key={layer}
                  className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground"
                >
                  <span className="flex size-4 items-center justify-center border border-border bg-background">
                    <span className="size-2 bg-foreground" />
                  </span>
                  {layer}
                </label>
              )
            )}
          </aside>

          {/* Map placeholder */}
          <div className="relative flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
            {/* Grid overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(to right, oklch(0 0 0 / 6%) 1px, transparent 1px), linear-gradient(to bottom, oklch(0 0 0 / 6%) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="flex size-16 items-center justify-center border border-border bg-background">
                <Map className="size-8 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Peta Interaktif
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Library peta akan diintegrasikan di sini.
                  <br />
                  Gunakan{" "}
                  <code className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[11px]">
                    react-leaflet
                  </code>{" "}
                  atau{" "}
                  <code className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[11px]">
                    maplibre-gl
                  </code>
                  .
                </p>
              </div>
            </div>

            {/* Bottom toolbar placeholder */}
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 border border-border bg-background">
              {[Layers, Navigation2].map((Icon, i) => (
                <button
                  key={i}
                  className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
