import { cookies } from "next/headers";
import { cache } from "react";
import { UserRole, ProgramScope } from "./types/user";

export interface Session {
  isAuthenticated: boolean;
  userRole: UserRole;
  programScope: ProgramScope;
}

export const session = cache(async (): Promise<Session> => {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("session_id")?.value;
  const isAuthenticated = !!sessionValue;

  let userRole: UserRole = "viewer";
  let programScope: ProgramScope = "none";

  if (sessionValue) {
    try {
      const data = JSON.parse(sessionValue);
      userRole = data.role;
      programScope = data.scope;
    } catch (e) {
      console.error("Failed to parse session cookie", e);
    }
  }

  return {
    isAuthenticated,
    userRole,
    programScope,
  };
});
