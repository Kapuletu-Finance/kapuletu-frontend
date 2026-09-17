import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/env";

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const isTreasurerRoute = pathname.startsWith("/treasurer");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/verify-email",
    "/verify-phone",
    "/verify-2fa",
  ].some((route) => pathname.startsWith(route));
  // Routes that require authentication but are not role-scoped dashboard routes
  const isAuthenticatedOnlyRoute = false;
  const isRootRoute = pathname === "/";

  if (
    !isTreasurerRoute &&
    !isAdminRoute &&
    !isAuthRoute &&
    !isAuthenticatedOnlyRoute &&
    !isRootRoute
  ) {
    return NextResponse.next();
  }

  const accessTokenCookieName = env.ACCESS_TOKEN_COOKIE_NAME;
  const roleCookieName = env.NEXT_PUBLIC_ROLE_COOKIE_NAME;

  const accessToken = request.cookies.get(accessTokenCookieName)?.value;
  const userRole = request.cookies.get(roleCookieName)?.value;
  const phoneVerified = request.cookies.get("phone_verified")?.value;
  const isWaitlisted = request.cookies.get("is_waitlisted")?.value === "true";

  // Signed-in user logic
  if (accessToken && userRole) {
    if (isWaitlisted) {
      if (pathname !== "/waitlist") {
        return NextResponse.redirect(new URL("/waitlist", request.url));
      }
      return NextResponse.next();
    }

    // If phone is not verified, restrict access to only the verify-phone page
    if (phoneVerified === "false") {
      if (!isAuthRoute) {
        return NextResponse.redirect(new URL("/verify-phone", request.url));
      }
      return NextResponse.next();
    }

    // Redirect away from auth pages to their dashboard
    if (isAuthRoute) {
      if (userRole === "treasurer")
        return NextResponse.redirect(new URL("/treasurer", request.url));
      if (userRole === "admin" || userRole === "super_admin")
        return NextResponse.redirect(new URL("/admin", request.url));
      return NextResponse.next();
    }

    // Role-Based Cross-Routing Restrictions
    if (userRole === "treasurer" && isAdminRoute) {
      return NextResponse.redirect(new URL("/treasurer", request.url));
    }

    if ((userRole === "admin" || userRole === "super_admin") && isTreasurerRoute) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Valid session and valid role scope, allow access
    return NextResponse.next();
  }

  // Unauthenticated user attempting to access secure routes
  if (isTreasurerRoute || isAdminRoute || pathname === "/waitlist") {
    const signInUrl = new URL("/sign-in", request.url);
    // Optionally preserve the attempted URL for post-sign in redirect
    signInUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Allow unauthenticated access to root and auth routes
  return NextResponse.next();
};

export const config = {
  // Apply middleware to protected routes, auth routes, and the root route
  matcher: [
    "/treasurer/:path*",
    "/admin/:path*",
    "/",
    "/sign-in",
    "/sign-up",
    "/forgot-password/:path*",
    "/verify-email",
    "/verify-phone",
  ],
};
