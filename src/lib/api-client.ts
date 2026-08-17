import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { deleteCookie } from "cookies-next";
import { toast } from "sonner";
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
    // If we receive a 401 Unauthorized or 403 Forbidden after the proxy's
    // resilience loop has already tried (and failed) to refresh, we must log out.
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

          // Show a single toast
          toast.error("Your session has expired. Please log in again.");

          // Force redirect to sign in
          window.location.href = "/sign-in";
        }
      }
    }

    // Try to extract a human-readable message from the response payload
    if (error.response?.data && typeof error.response.data === "object") {
      const data = error.response.data as ApiErrorResponse;
      if (typeof data.detail === "string") {
        error.message = data.detail;
      } else if (Array.isArray(data.detail)) {
        // Handle Pydantic validation errors
        error.message = data.detail.map((err) => err.msg).join(", ");
      } else if (typeof data.message === "string") {
        error.message = data.message;
      }
    }

    return Promise.reject(error);
  },
);
