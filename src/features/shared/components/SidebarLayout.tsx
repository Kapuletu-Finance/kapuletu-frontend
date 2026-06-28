import { cookies } from "next/headers";
import type React from "react";
import type { UserRole } from "@/features/auth/utils";
import { SidebarLayoutClient } from "@/features/shared/components/SidebarLayoutClient";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = async ({ children }) => {
  const cookieStore = await cookies();
  const role = (cookieStore.get("user_role")?.value as UserRole) || null;

  return <SidebarLayoutClient role={role}>{children}</SidebarLayoutClient>;
};
