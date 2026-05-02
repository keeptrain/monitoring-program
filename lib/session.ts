import { ProgramScope, UserRole } from "@/features/auth/types/user";
import { SessionOptions } from "iron-session";

export interface SessionData {
  sub: string;
  role: UserRole;
  programScope: ProgramScope;
  isLoggedIn: boolean;
}

const ttl = 604800 as const;

export const sessionOptions: SessionOptions = {
  password: process.env.IRON_SESSION_PASSWORD!,
  cookieName: "session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ttl - 60, // 60 detik buffer untuk menghindari race condition
  },
  ttl,
};
