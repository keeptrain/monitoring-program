import Navbar from "@/components/Navbar";
import { Header } from "@/features/monitoring/PublicMonitoringPage";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr]">
      <Navbar />
      <main className="bg-background flex flex-col">
        <Header />
        {children}
      </main>
    </div>
  );
}
