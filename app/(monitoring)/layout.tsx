import MonitoringNavbar from "@/components/navbar/MonitoringNavbar";

export default function MonitoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MonitoringNavbar />
      {children}
    </>
  );
}
