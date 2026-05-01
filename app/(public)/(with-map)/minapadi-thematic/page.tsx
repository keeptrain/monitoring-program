import { checkRoleGuard } from "@/proxy";
import { session } from "@/features/auth/session";

export default async function MinapadiMonitoringPage() {
  await checkRoleGuard("minapadi-thematic");
  const { isAuthenticated } = await session();

  return (
    <div className="flex flex-col gap-4">
      {/* Content for Minapadi will be added here */}
    </div>
  );
}
