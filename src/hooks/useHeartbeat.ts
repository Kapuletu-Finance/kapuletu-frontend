import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useGetMeQuery } from "@/features/auth/services/queries";
import { apiClient } from "@/lib/api-client";

// Maps routes to human-readable actions for the admin dashboard
const routeToActionMap: Record<string, string> = {
  "/treasurer/payments": "Managing Payments",
  "/treasurer/groups": "Managing Groups",
  "/treasurer/campaigns": "Viewing Campaigns",
  "/treasurer/reports": "Viewing Reports",
  "/treasurer/settings": "Updating Settings",
  "/treasurer/feedback": "Submitting Feedback",
  "/treasurer": "Viewing Dashboard",
  "/admin/users": "Managing Users",
  "/admin/finance": "Viewing Finance Metrics",
  "/admin/ai": "AI Governance",
  "/admin/crm": "Sending Broadcasts",
  "/admin/performance": "Monitoring Performance",
  "/admin/audit": "Viewing Audit Logs",
  "/admin/config": "Updating Settings",
  "/admin": "Admin Dashboard",
};

export const useHeartbeat = (intervalMs = 60000) => {
  const pathname = usePathname();
  const { data: user } = useGetMeQuery();
  const isAuthenticated = !!user;

  // Use a ref so the interval callback always sees the latest pathname without restarting the timer
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const pingHeartbeat = async () => {
      try {
        const path = pathnameRef.current || "/";

        // Find the most specific match
        let currentAction = "Active";
        const keys = Object.keys(routeToActionMap).sort((a, b) => b.length - a.length);

        for (const key of keys) {
          if (path.startsWith(key)) {
            currentAction = routeToActionMap[key];
            break;
          }
        }

        // Fire and forget
        await apiClient.put("/auth/me/heartbeat", { current_action: currentAction });
      } catch (_error) {
        // Silently fail for heartbeats to avoid spamming the console
      }
    };

    // Ping immediately on mount/auth
    pingHeartbeat();

    // Set up interval
    const intervalId = setInterval(pingHeartbeat, intervalMs);

    return () => clearInterval(intervalId);
  }, [isAuthenticated, intervalMs]);
};
