"use client";

import { usePathname } from "next/navigation";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { ThemeToggle } from "@/features/shared/components/ThemeToggle";

export const PublicThemeToggle = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/treasurer")) {
    return null;
  }

  const isVerifyPage = pathname === "/verify-phone" || pathname === "/verify-email";

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
      {isVerifyPage && <SignOutButton />}
      <ThemeToggle />
    </div>
  );
};
