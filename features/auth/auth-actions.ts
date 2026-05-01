"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserRole, ProgramScope } from "./types/user";

export async function login(
  role: UserRole = "viewer",
  scope: ProgramScope = "none",
) {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify({ role, scope });

  cookieStore.set("session_id", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

import { loginFormSchema } from "./form/login-schema";
import z from "zod";

export type ActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

const MOCK_USERS: {
  email: string;
  role: UserRole;
  scope: ProgramScope;
}[] = [
  // PMO
  {
    email: "pmobioflok@test.com",
    role: "pmo",
    scope: "biofloc",
  },
  {
    email: "pmominapadi@test.com",
    role: "pmo",
    scope: "minapadi",
  },
  { email: "pmoisf@test.com", role: "pmo", scope: "isf" },
  {
    email: "pmorevitalisasi@test.com",
    role: "pmo",
    scope: "revitalization",
  },
  // Petugas (Officer)
  {
    email: "petugasbioflok@test.com",
    role: "officer",
    scope: "biofloc",
  },
  {
    email: "petugasminapadi@test.com",
    role: "officer",
    scope: "minapadi",
  },
  {
    email: "petugasisf@test.com",
    role: "officer",
    scope: "isf",
  },
  {
    email: "petugasrevitalisasi@test.com",
    role: "officer",
    scope: "revitalization",
  },
  // Admin
  {
    email: "adminbioflok@test.com",
    role: "admin",
    scope: "biofloc",
  },
  {
    email: "adminminapadi@test.com",
    role: "admin",
    scope: "minapadi",
  },
  {
    email: "adminisf@test.com",
    role: "admin",
    scope: "isf",
  },
  {
    email: "adminrevitalisasi@test.com",
    role: "admin",
    scope: "revitalization",
  },
] as const;

export async function loginWithCredentials(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = loginFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  // Check mock users
  const user = MOCK_USERS.find((u) => u.email === email);

  if (!user) {
    return {
      success: false,
      errors: {
        email: ["Email atau password salah."],
      },
    };
  }

  await login(user.role, user.scope);

  if (user.role === "admin" || user.role === "pmo") {
    redirect("/dashboard");
  } else {
    redirect("/");
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session_id");
}
