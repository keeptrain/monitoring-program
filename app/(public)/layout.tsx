import Navbar from "@/components/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr]">
      <Navbar />
      <main className="bg-background flex flex-col">{children}</main>
    </div>
  );
}
