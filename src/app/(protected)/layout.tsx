import type React from "react";
import { SidebarLayout } from "@/features/shared/components/SidebarLayout";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  return <SidebarLayout>{children}</SidebarLayout>;
};

export default ProtectedLayout;
