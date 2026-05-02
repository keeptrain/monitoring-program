import { redirect } from "next/navigation";
import { getSession } from "./session";
import { ProgramScope, UserRole } from "./types/user";

const SCOPE_TO_PATH: Record<string, string> = {
  biofloc: "biofloc-thematic",
  minapadi: "minapadi-thematic",
  isf: "isf",
  revitalisasi: "revitalisasi",
};

export function getRedirectPath(
  role: UserRole,
  programScope: ProgramScope,
): string {
  return role === "officer" ? `/${SCOPE_TO_PATH[programScope]}` : "/dashboard";
}

export async function checkRoleGuard(currentType: string) {
  try {
    const sessionData = await getSession();
    if (!sessionData.isLoggedIn) return;

    // If user has access to everything, allow.
    if (sessionData.programScope === "all") return;

    const allowedPath = SCOPE_TO_PATH[sessionData.programScope as string];

    // If current page path doesn't match the allowed path for their scope, redirect.
    if (allowedPath && currentType !== allowedPath) {
      redirect(`/${allowedPath}`);
    }
  } catch (error) {
    // Session helper throws UNAUTHORIZED if no session.sub
    // This is expected and handled by middleware or parent components.
    return;
  }
}
