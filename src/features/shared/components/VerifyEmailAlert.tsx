"use client";

import { AlertCircle, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AUTH_EVENTS, AUTH_LOCAL_STORAGE_KEYS } from "@/features/auth/keys";
import { useGetMeQuery } from "@/features/auth/services/queries";

export const VerifyEmailAlert = () => {
  const { data: user, isLoading } = useGetMeQuery();
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    setIsDismissed(
      localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.VERIFY_EMAIL_ALERT_DISMISSED) === "true",
    );

    const handleEvent = () =>
      setIsDismissed(
        localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.VERIFY_EMAIL_ALERT_DISMISSED) === "true",
      );
    window.addEventListener(AUTH_EVENTS.VERIFY_EMAIL_DISMISSED, handleEvent);
    return () => window.removeEventListener(AUTH_EVENTS.VERIFY_EMAIL_DISMISSED, handleEvent);
  }, []);

  const dismissAlert = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEYS.VERIFY_EMAIL_ALERT_DISMISSED, "true");
    window.dispatchEvent(new Event(AUTH_EVENTS.VERIFY_EMAIL_DISMISSED));
  };

  // If loading or if we know the user is verified, don't show the banner
  // Default to showing if we don't know (or if explicitly false)
  if (isLoading || !user || user.email_verified || isDismissed) {
    return null;
  }

  return (
    <div className="mb-6">
      <Link href="/verify-email" className="block">
        <div className="bg-burnt-amber/10 border border-burnt-amber/20 rounded-xl p-4 flex items-center justify-between hover:bg-burnt-amber/20 transition-colors cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="bg-burnt-amber/20 p-2 rounded-lg group-hover:bg-burnt-amber/30 transition-colors">
              <AlertCircle className="w-5 h-5 text-burnt-amber" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-burnt-amber">Please verify your email</h3>
              <p className="text-xs text-burnt-amber mt-0.5">
                Verify your email address to unlock full access to KapuLetu features.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={dismissAlert}
            className="h-7 w-7 hover:bg-burnt-amber/20 text-burnt-amber/70 hover:text-burnt-amber"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Link>
    </div>
  );
};
