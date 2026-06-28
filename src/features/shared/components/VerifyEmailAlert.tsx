"use client";

import { AlertCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useGetMeQuery } from "@/features/auth/services/queries";

export const VerifyEmailAlert = () => {
  const { data: user, isLoading } = useGetMeQuery();

  // If loading or if we know the user is verified, don't show the banner
  // Default to showing if we don't know (or if explicitly false)
  if (isLoading || !user || user.is_email_verified) {
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
          <ChevronRight className="w-5 h-5 text-burnt-amber/70 group-hover:text-burnt-amber transition-colors" />
        </div>
      </Link>
    </div>
  );
};
