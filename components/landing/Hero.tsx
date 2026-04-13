import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FishIcon, FishingHookIcon } from "lucide-react";

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

      <div className="relative z-10 mx-auto max-w-3xl space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-border bg-muted px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground" />
          Direktorat Jenderal Perikanan Budidaya <FishIcon className="size-4" />{" "}
          <FishingHookIcon className="size-4" />
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Monitoring Program
          <br />
          <span className="text-muted-foreground">Prioritas DJPB</span>
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
          Platform pemantauan terpadu untuk program-program prioritas Direktorat
          Jenderal Perikanan Budidaya, Kementerian Kelautan dan Perikanan
          Republik Indonesia.
        </p>

        {/* CTAs */}
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/monitoring">
            Lihat Peta Monitoring
            <ArrowRight className="ml-2 size-6" />
          </Link>
        </Button>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}
