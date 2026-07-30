import Link from "next/link";
import type React from "react";
import { buttonVariants } from "@/components/ui/button";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { SiteLogo } from "@/features/shared/components/SiteLogo";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "text-muted-foreground font-semibold",
          )}
        >
          <IconLibrary name="chevron-left" className="mr-2 h-4 w-4" />
          GO BACK
        </Link>
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col items-center px-4">
        <SiteLogo width={48} height={48} className="mb-6" />

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
