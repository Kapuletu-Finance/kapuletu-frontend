"use client";

import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { env } from "@/env";
import { useLogoutMutation } from "@/features/auth/services/mutations";

export const SessionTimeoutListener = () => {
  const { mutate: logout } = useLogoutMutation();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set timeout if the user is logged in (has a role cookie)
    const role = getCookie(env.NEXT_PUBLIC_ROLE_COOKIE_NAME);

    // Check if we are on a public auth page. If so, don't run the timeout.
    const isPublicRoute = [
      "/sign-in",
      "/sign-up",
      "/forgot-password",
      "/verify-phone",
      "/verify-2fa",
    ].some((route) => pathname.startsWith(route));

    if (role && !isPublicRoute) {
      timeoutRef.current = setTimeout(() => {
        toast.error("Session expired due to inactivity.");
        // Redirect logic is inside logout mutation, but we append ?reason=session_expired
        logout();
        // Since logout mutation redirects to /sign-in, it won't have the reason query param unless we explicitly set it.
        // We'll let the mutation redirect, then append it if possible, or just let it be.
        setTimeout(() => {
          window.location.href = "/sign-in?reason=session_expired";
        }, 500);
      }, SESSION_TIMEOUT_MS);
    }
  };

  useEffect(() => {
    // Initial setup
    resetTimeout();

    // Events that indicate activity
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];

    const handleActivity = () => {
      resetTimeout();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [
    // Initial setup
    resetTimeout,
  ]); // Re-run when pathname changes

  return null;
};
