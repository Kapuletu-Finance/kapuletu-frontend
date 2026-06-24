import { cookies } from "next/headers";
import type React from "react";
import { SidebarLayoutClient } from "@/components/shared/SidebarLayoutClient";
import type { UserRole } from "@/features/auth/utils/auth-utils";

export const SidebarLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const role = (cookieStore.get("user_role")?.value as UserRole) || null;

  return <SidebarLayoutClient role={role}>{children}</SidebarLayoutClient>;
};
