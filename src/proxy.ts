import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/env";

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // We only care about /treasurer and /admin route groups
  const isTreasurerRoute = pathname.startsWith("/treasurer");
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isTreasurerRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const accessTokenCookieName = env.ACCESS_TOKEN_COOKIE_NAME;
  const roleCookieName = env.NEXT_PUBLIC_ROLE_COOKIE_NAME;

  const accessToken = request.cookies.get(accessTokenCookieName)?.value;
  const userRole = request.cookies.get(roleCookieName)?.value;

  // Unauthenticated user attempting to access secure routes
  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    // Optionally preserve the attempted URL for post-login redirect
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-Based Cross-Routing Restrictions
  if (userRole === "treasurer" && isAdminRoute) {
    // Treasurers shouldn't access admin
    return NextResponse.redirect(new URL("/treasurer/transactions", request.url));
  }

  if (userRole === "admin" && isTreasurerRoute) {
    // Admins shouldn't access treasurer
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Valid session and valid role scope, allow access
  return NextResponse.next();
};

export const config = {
  // Apply middleware only to /treasurer/* and /admin/* routes
  matcher: ["/treasurer/:path*", "/admin/:path*"],
};
