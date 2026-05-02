import { cookies } from "next/headers";
import { cache } from "react";
import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { ProgramScope, UserRole } from "./types/user";

export async function getSession(): Promise<SessionData> {
  const cookieStore = await cookies();
  const ironSession = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions,
  );
  return {
    sub: ironSession.sub,
    role: ironSession.role,
    programScope: ironSession.programScope,
    isLoggedIn: !!ironSession.isLoggedIn,
  };
}

export const getSessionCached = cache(async (): Promise<SessionData> => {
  return await getSession();
});

export async function buildSession(
  sub: string, // user id
  role: UserRole,
  programScope: ProgramScope,
) {
  const cookieStore = await cookies();
  const ironSession = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions,
  );
  ironSession.sub = sub;
  ironSession.role = role;
  ironSession.programScope = programScope;
  ironSession.isLoggedIn = true;
  await ironSession.save();
}
