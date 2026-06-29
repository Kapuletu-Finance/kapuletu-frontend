import type React from "react";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto flex flex-col items-center px-4">
        <SiteLogo width={48} height={48} className="mb-6" />

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
