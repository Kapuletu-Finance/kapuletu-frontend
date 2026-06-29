import { getCookie } from "cookies-next";
import type { NextRequest } from "next/server";
import { env } from "@/env";

export const ACCESS_TOKEN_COOKIE_NAME = env.ACCESS_TOKEN_COOKIE_NAME;
export const REFRESH_TOKEN_COOKIE_NAME = env.REFRESH_TOKEN_COOKIE_NAME;
export const ROLE_COOKIE_NAME = env.NEXT_PUBLIC_ROLE_COOKIE_NAME;
export const CSRF_HEADER_NAME = env.NEXT_PUBLIC_CSRF_HEADER_NAME;

export const SECURE_COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export const PUBLIC_COOKIE_OPTIONS = {
  httpOnly: false,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

/**
 * Validates the CSRF shield for non-GET requests.
 */
export const validateCsrfShield = (request: NextRequest): boolean => {
  if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") {
    return true;
  }
  return request.headers.get(CSRF_HEADER_NAME) === "true";
};

export type UserRole = "admin" | "treasurer" | null;

export const getRoleFromCookie = (): UserRole => {
  if (typeof document === "undefined") return null;
  // Use the standard ROLE_COOKIE_NAME if it matches what sidebar expects
  // The sidebar regex was looking for `user_role=`
  const role = getCookie("user_role");
  if (role) return role as UserRole;
  return null;
};
