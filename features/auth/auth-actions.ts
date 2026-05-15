"use server";

import { cookies } from "next/headers";
import { loginFormSchema } from "./form/login-schema";
import z from "zod";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import * as db from "@/features/auth/services/login-services";
import { buildSession } from "./session";
import { getRedirectPath, SCOPE_TO_PATH } from "./utils";

export type ActionState = {
  success: boolean;
  errors?: {
    [key: string]: string[] | undefined;
  };
  message?: string;
  redirectPath?: string;
};

export async function getSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );

  if (!session.isLoggedIn) {
    return {
      success: false,
      message: "Anda harus login terlebih dahulu.",
    };
  }

  return session;
}

export async function login(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const validatedFields = loginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  let redirectPath = "/";
  // Check mock users
  try {
    const user = await db.login(email, password);
    await buildSession(user.id, user.role, user.programScope);
    redirectPath = getRedirectPath(user.role, user.programScope);
  } catch (error) {
    return {
      success: false,
      errors: {
        email: ["Email atau password salah."],
      },
    };
  }

  return {
    success: true,
    message: "Login berhasil.",
    redirectPath,
  };
}

export async function logout() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions,
  );

  const redirectPath = SCOPE_TO_PATH[session.programScope];
  session.destroy();
  
  return {
    success: true,
    data: {
      href: redirectPath,
    },
  };
}
