import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import ProgramList from "@/components/landing/ProgramList";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "Program Prioritas DJPB — Kementerian Kelautan dan Perikanan",
  description:
    "Platform monitoring terpadu untuk program-program prioritas Direktorat Jenderal Perikanan Budidaya, Kementerian Kelautan dan Perikanan Republik Indonesia.",
};

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <Features />
        <ProgramList />
      </main>
      <Footer />
    </>
  );
}
