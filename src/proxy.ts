import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/env";

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const isTreasurerRoute = pathname.startsWith("/treasurer");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = ["/sign-in", "/sign-up", "/forgot-password"].some((route) =>
    pathname.startsWith(route),
  );
  // Routes that require authentication but are not role-scoped dashboard routes
  const isAuthenticatedOnlyRoute = ["/verify-email", "/verify-phone"].includes(pathname);
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

  // Signed-in user logic
  if (accessToken && userRole) {
    // If phone is not verified, restrict access to only the verify-phone page
    if (phoneVerified === "false") {
      if (!isAuthenticatedOnlyRoute && !isAuthRoute) {
        return NextResponse.redirect(new URL("/verify-phone", request.url));
      }
      return NextResponse.next();
    }

    // Redirect away from root and auth pages to their dashboard
    if (isRootRoute || isAuthRoute) {
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
  if (isTreasurerRoute || isAdminRoute || isAuthenticatedOnlyRoute) {
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
