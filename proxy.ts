import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "./lib/session";

const protectedRoutes = "/dashboard";
const publicRoutes = ["/login"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = request.nextUrl.pathname.startsWith(protectedRoutes);
  const isPublicRoute = publicRoutes.includes(path);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", path); // Inject the current pathname into a custom header
  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  const session = await getIronSession<SessionData>(
    request,
    res,
    sessionOptions,
  );

  if (isProtectedRoute && !session.isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicRoute && session.isLoggedIn && session.role !== "officer") {
    return NextResponse.redirect(new URL(protectedRoutes, request.url));
  }

  return res;
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
