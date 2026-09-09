"use client";

import { usePathname } from "next/navigation";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { ThemeToggle } from "@/features/shared/components/ThemeToggle";

export const PublicThemeToggle = () => {
  const pathname = usePathname();

  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-phone",
    "/verify-email",
  ];

  if (!publicRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  const isVerifyPage = pathname === "/verify-phone" || pathname === "/verify-email";

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
      {isVerifyPage && <SignOutButton />}
      <ThemeToggle variant="ghost" />
    </div>
  );
};
