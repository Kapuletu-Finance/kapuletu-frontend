import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { deleteCookie } from "cookies-next";
import { env } from "@/env";
import { getQueryClient } from "@/lib/query-client";
import type { ApiErrorResponse } from "@/types/api";

const CSRF_HEADER_NAME = env.NEXT_PUBLIC_CSRF_HEADER_NAME;

let isRedirecting = false;

/**
 * Instantiate a global Axios client instance targeting our BFF endpoint.
 * We set `withCredentials: true` globally so that our browser implicitly
 * sends the HTTP-Only cookies to the same-origin Next.js proxy route.
 */
export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * Request Interceptor: CSRF Shield Automation
 * We automatically attach the custom CSRF prevention header `X-KapuLetu-BFF: true`
 * to all state-changing operations to satisfy the proxy's protection mechanisms.
 */
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const method = config.method?.toUpperCase();
  if (method && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    config.headers.set(CSRF_HEADER_NAME, "true");
  }
  return config;
});

/**
 * Response Interceptor: Global Error Boundaries
 * We monitor the stream for authentication failures (401/403). Because the proxy
 * handles the actual JWT refresh loops seamlessly, if a 401 reaches this client
 * interceptor, it means the refresh token is also dead and the session is truly over.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Check if this is a billing/premium limit error (402 or specific 403s)
    const errData = error.response?.data as Record<string, unknown> | undefined;
    const errDetail = typeof errData?.detail === "string" ? errData.detail : "";
    const errCode = typeof errData?.code === "string" ? errData.code : "";

    if (
      error.response?.status === 402 ||
      (error.response?.status === 403 &&
        (errDetail.includes("limit reached") ||
          errDetail.includes("Upgrade required") ||
          errCode === "UPGRADE_REQUIRED"))
    ) {
      if (typeof window !== "undefined") {
        let message = "You've discovered a premium feature!";
        if (error.response.data && typeof error.response.data === "object") {
          const data = error.response.data as ApiErrorResponse;
          if (typeof data.detail === "string") message = data.detail;
        }
        window.dispatchEvent(new CustomEvent("upgrade_required", { detail: { message } }));
      }
      return Promise.reject(error);
    }

    // If we receive a 401 Unauthorized, or a true 403 Forbidden (not billing related),
    // after the proxy's resilience loop has already tried (and failed) to refresh, we must log out.
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== "undefined") {
        // We ensure we only redirect if we aren't already on the sign in page
        if (!window.location.pathname.startsWith("/sign-in") && !isRedirecting) {
          isRedirecting = true;
          console.warn("Session explicitly terminated or CSRF blocked. Redirecting to sign in.");

          // Clear TanStack Query cache
          getQueryClient().clear();

          // Clear any non-HTTP-only client cookies explicitly if needed
          deleteCookie("user_role", { path: "/" });

          // Force redirect to sign in with reason
          window.location.href = "/sign-in?reason=session_expired";
        }
      }
    }

    // Try to extract a human-readable message from the response payload
    if (error.response?.status === 500) {
      error.message = "Oops! Something went wrong on our end. Please try again later.";
    } else if (error.response?.data && typeof error.response.data === "object") {
      const data = error.response.data as ApiErrorResponse;
      if (typeof data.detail === "string") {
        error.message = data.detail;
      } else if (Array.isArray(data.detail)) {
        // Sanitize Pydantic validation errors
        error.message = "Please check the highlighted fields and try again.";
      } else if (typeof data.message === "string") {
        error.message = data.message;
      }
    } else if (!error.response) {
      error.message = "Please check your internet connection and try again.";
    }

    return Promise.reject(error);
  },
);
