import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const SCOPE_TO_PATH: Record<string, string> = {
  biofloc: "biofloc-thematic",
  minapadi: "minapadi-thematic",
  isf: "isf",
  revitalisasi: "revitalisasi",
};

export default function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  // Inject the current pathname into a custom header
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const pathname = requestHeaders.get("x-pathname");

  console.log("Pathname dari Header:", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

import { session } from "@/features/auth/session";

export async function checkRoleGuard(currentType: string) {
  const { isAuthenticated, programScope } = await session();

  if (!isAuthenticated) return;

  // If user has access to everything, allow.
  if (programScope === "all") return;

  const allowedPath = SCOPE_TO_PATH[programScope];

  // If current page path doesn't match the allowed path for their scope, redirect.
  if (allowedPath && currentType !== allowedPath) {
    redirect(`/${allowedPath}`);
  }
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
};
