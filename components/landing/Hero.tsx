import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FishIcon, FishingHookIcon } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden border-b border-border bg-background px-6 text-center"
    >
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0 0 0 / 4%) 1px, transparent 1px), linear-gradient(to bottom, oklch(0 0 0 / 4%) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-between gap-12 lg:flex-row">
        <div className="max-w-3xl space-y-8 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-border bg-muted px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Direktorat Jenderal Perikanan Budidaya{" "}
            <FishIcon className="size-4" />{" "}
            <FishingHookIcon className="size-4" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Monitoring Program
            <br />
            <span className="text-muted-foreground">Prioritas DJPB</span>
          </h1>

          {/* Sub-headline */}
          <p className="mx-auto max-w-xl text-base text-muted-foreground lg:mx-0 sm:text-lg">
            Platform pemantauan terpadu untuk program-program prioritas
            Direktorat Jenderal Perikanan Budidaya, Kementerian Kelautan dan
            Perikanan Republik Indonesia.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/monitoring">
                Lihat Peta Monitoring
                <ArrowRight className="ml-2 size-6" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Mini Collage - Hidden on mobile */}
        <div className="hidden lg:relative lg:block shrink-0">
          <div className="grid grid-cols-2 gap-4 opacity-80 transition-opacity hover:opacity-100">
            <Image
              src="/images/revitalisasi-tambak-pantura.jpg"
              alt="Hero 1"
              width={190}
              height={224}
              className="border border-border shadow-sm transition-transform hover:-translate-y-2 object-cover"
            />
            <Image
              src="/images/bioflok.jpeg"
              alt="Hero 1"
              width={200}
              height={224}
              className="border border-border shadow-sm transition-transform hover:-translate-y-2 object-cover"
            />
            <Image
              src="/images/tambak-udang.jpg"
              alt="Hero 1"
              width={200}
              height={300}
              className="border border-border shadow-sm transition-transform hover:-translate-y-2 object-cover"
            />
            <Image
              src="/images/revitalisasi-tambak-pantura.jpg"
              alt="Hero 1"
              width={190}
              height={224}
              className="border border-border shadow-sm transition-transform hover:-translate-y-2 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}
