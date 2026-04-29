"use server";

import { cookies } from "next/headers";

export async function login() {
  const cookieStore = await cookies();
  cookieStore.set("session_id", "true");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session_id");
}
