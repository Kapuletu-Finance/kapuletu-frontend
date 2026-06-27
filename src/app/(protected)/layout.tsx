import type React from "react";
import { SidebarLayout } from "@/features/shared/components/SidebarLayout";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
