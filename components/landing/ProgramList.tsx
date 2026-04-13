import {
  Fish,
  Anchor,
  Waves,
  Ship,
  MapPinned,
  ShieldCheck,
} from "lucide-react";

// ─── Edit this array to add, remove, or update programs ──────────────────────
export const PROGRAMS = [
  {
    id: 1,
    icon: Fish,
    title: "Pengelolaan Perikanan Tangkap",
    description:
      "Program peningkatan produktivitas armada tangkap melalui modernisasi alat dan pendampingan nelayan.",
  },
  {
    id: 2,
    icon: Anchor,
    title: "Pengembangan Pelabuhan Perikanan",
    description:
      "Revitalisasi dan pembangunan infrastruktur pelabuhan perikanan di sentra produksi nasional.",
  },
  {
    id: 3,
    icon: Waves,
    title: "Budidaya Perikanan Berkelanjutan",
    description:
      "Fasilitasi teknologi budi daya ramah lingkungan serta penguatan kapasitas pembudidaya ikan.",
  },
  {
    id: 4,
    icon: Ship,
    title: "Pengawasan Sumber Daya Kelautan",
    description:
      "Penguatan sistem pengawasan laut melalui kapal patroli dan teknologi pemantauan satelit.",
  },
  {
    id: 5,
    icon: MapPinned,
    title: "Pemetaan Potensi Kelautan",
    description:
      "Survei dan pemetaan sumber daya kelautan nasional untuk mendukung perencanaan berbasis data.",
  },
  {
    id: 6,
    icon: ShieldCheck,
    title: "Keselamatan Nelayan",
    description:
      "Program distribusi alat keselamatan, pelatihan, dan jaminan sosial bagi nelayan di seluruh Indonesia.",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function ProgramList() {
  return (
    <section
      id="programs"
      className="border-b border-border bg-background px-6 py-20"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Program Prioritas
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Program Unggulan DJPB
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
            Berikut adalah program-program prioritas yang sedang dijalankan oleh
            Direktorat Jenderal Perbendaharaan periode 2024–2029.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map(({ id, icon: Icon, title, description }) => (
            <article
              key={id}
              className="group flex flex-col gap-5 bg-background p-8 transition-colors hover:bg-muted/50"
            >
              {/* Numbered badge + icon */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium tabular-nums text-muted-foreground">
                  {String(id).padStart(2, "0")}
                </span>
                <div className="flex size-9 items-center justify-center border border-border transition-colors group-hover:border-foreground">
                  <Icon className="size-4 text-foreground" />
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold leading-snug text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
