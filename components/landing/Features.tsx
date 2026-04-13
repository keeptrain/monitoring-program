import { CheckCircle2, Globe2, TrendingUp } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Pemantauan Real-Time",
    description:
      "Pantau progres realisasi anggaran dan capaian program secara langsung dengan data yang selalu diperbarui.",
  },
  {
    icon: Globe2,
    title: "Peta Sebaran Lokasi",
    description:
      "Visualisasi geografis seluruh lokasi pelaksanaan program prioritas se-Indonesia dalam satu tampilan peta interaktif.",
  },
  {
    icon: CheckCircle2,
    title: "Laporan Terstruktur",
    description:
      "Laporan komprehensif setiap program disajikan dengan format standar pemerintah yang mudah dibaca.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="border-b border-border bg-muted/40 px-6 py-20"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Fitur Utama
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Satu Platform, Semua Informasi
          </h2>
        </div>

        {/* Grid */}
        <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-4 bg-background p-8 transition-colors hover:bg-muted/60"
            >
              <div className="flex size-10 items-center justify-center border border-border">
                <Icon className="size-5 text-foreground" />
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
