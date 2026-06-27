import axios from "axios";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { authSecurityRules } from "@/features/auth/security";
import { AUTH_URLS } from "@/features/auth/urls";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  PUBLIC_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  ROLE_COOKIE_NAME,
  SECURE_COOKIE_OPTIONS,
  validateCsrfShield,
} from "@/features/auth/utils";
import { campaignsSecurityRules } from "@/features/campaigns/security";
import { groupsSecurityRules } from "@/features/groups/security";
import { transactionsSecurityRules } from "@/features/transactions/security";

const securityRegistry = [
  ...authSecurityRules,
  ...transactionsSecurityRules,
  ...campaignsSecurityRules,
  ...groupsSecurityRules,
];

const BACKEND_URL = env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Handles the actual API proxying.
 */
const proxyRequest = async (request: NextRequest, attemptRefresh = true): Promise<NextResponse> => {
  const url = new URL(request.url);
  const backendPath = url.pathname.replace(/^\/api/, "");
  const targetUrl = `${BACKEND_URL}${backendPath}${url.search}`;

  if (!validateCsrfShield(request)) {
    return NextResponse.json(
      { error: "CSRF Shield validation failed. Missing X-KapuLetu-BFF header." },
      { status: 403 },
    );
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  const role = cookieStore.get(ROLE_COOKIE_NAME)?.value;

  const matchedRule = securityRegistry.find((rule) =>
    typeof rule.path === "string" ? rule.path === backendPath : rule.path.test(backendPath),
  );

  if (matchedRule && !matchedRule.skipAuth) {
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (matchedRule.allowedRoles && (!role || !matchedRule.allowedRoles.includes(role))) {
      return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
    }
  }

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "host") {
      headers[key] = value;
    }
  });

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  // Clone the request body if it's not a GET/HEAD
  let data: unknown;
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      data = await request.clone().json();
    } catch {
      data = await request.clone().arrayBuffer();
    }
  }

  try {
    let axiosResponse = await axios({
      data,
      headers,
      method: request.method,
      responseType: "arraybuffer", // For generic proxying
      url: targetUrl,
      validateStatus: () => true, // Mimic fetch behavior (don't throw on HTTP errors)
    });

    // Resilience Loop: Intercept 401 Unauthorized for token refresh
    if (axiosResponse.status === 401 && refreshToken && attemptRefresh) {
      const refreshResponse = await axios.post(
        `${BACKEND_URL}/auth/refresh`,
        { refresh_token: refreshToken },
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      if (refreshResponse.status >= 200 && refreshResponse.status < 300) {
        const refreshData = refreshResponse.data;
        const newAccessToken = refreshData.access_token;
        const newRefreshToken = refreshData.refresh_token;

        if (newAccessToken) {
          cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, newAccessToken, SECURE_COOKIE_OPTIONS);
          if (newRefreshToken) {
            cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, SECURE_COOKIE_OPTIONS);
          }

          // Replay the original request with the new access token
          headers.Authorization = `Bearer ${newAccessToken}`;
          axiosResponse = await axios({
            data,
            headers,
            method: request.method,
            responseType: "arraybuffer",
            url: targetUrl,
            validateStatus: () => true,
          });
        }
      } else {
        // Refresh failed, clear cookies
        cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME);
        cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
        cookieStore.delete(ROLE_COOKIE_NAME);
      }
    }

    // Handle Auth Login Interception
    if (
      backendPath === AUTH_URLS.LOGIN &&
      axiosResponse.status >= 200 &&
      axiosResponse.status < 300
    ) {
      // Decode arraybuffer back to JSON
      const jsonString = Buffer.from(axiosResponse.data).toString("utf-8");
      const responseData = JSON.parse(jsonString);
      const { access_token, refresh_token, role, ...userData } = responseData;

      if (access_token)
        cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, access_token, SECURE_COOKIE_OPTIONS);
      if (refresh_token)
        cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refresh_token, SECURE_COOKIE_OPTIONS);
      if (role) cookieStore.set(ROLE_COOKIE_NAME, role, PUBLIC_COOKIE_OPTIONS);

      return NextResponse.json({ ...userData, role }, { status: axiosResponse.status });
    }

    // Handle Auth Logout Interception
    if (backendPath === "/auth/logout") {
      cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME);
      cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
      cookieStore.delete(ROLE_COOKIE_NAME);
      return NextResponse.json(
        { message: "Logged out successfully" },
        { status: axiosResponse.status },
      );
    }

    // Relay normal backend responses
    const contentType = axiosResponse.headers["content-type"] as string | undefined;
    if (contentType?.includes("application/json")) {
      const jsonString = Buffer.from(axiosResponse.data as ArrayBuffer).toString("utf-8");
      // Fallback in case parsing fails
      let responseData: unknown = jsonString;
      try {
        responseData = JSON.parse(jsonString);
      } catch {
        // Ignored
      }

      return NextResponse.json(responseData, { status: axiosResponse.status });
    } else {
      return new NextResponse(axiosResponse.data as BodyInit, {
        headers: {
          "Content-Type": contentType || "application/octet-stream",
        },
        status: axiosResponse.status,
      });
    }
  } catch (error) {
    console.error("BFF Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error from BFF Proxy" }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  return proxyRequest(req);
};
export const POST = async (req: NextRequest) => {
  return proxyRequest(req);
};
export const PUT = async (req: NextRequest) => {
  return proxyRequest(req);
};
export const PATCH = async (req: NextRequest) => {
  return proxyRequest(req);
};
export const DELETE = async (req: NextRequest) => {
  return proxyRequest(req);
};
