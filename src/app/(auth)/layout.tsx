import Link from "next/link";
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

        <div className="text-center text-xs text-muted-foreground pt-6 leading-tight">
          By clicking continue, you agree to <br />
          our{" "}
          <Link
            href="/terms"
            className="underline decoration-border underline-offset-2 hover:text-foreground"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline decoration-border underline-offset-2 hover:text-foreground"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
