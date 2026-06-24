"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/features/shared/components/ThemeToggle";

export const PublicThemeToggle = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/treasurer")) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 z-50">
      <ThemeToggle />
    </div>
  );
};
