import { Cog, HardHat, Wrench } from "lucide-react";
import type { Metadata } from "next";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

export const metadata: Metadata = {
  title: "Maintenance | Kapuletu",
  description: "Kapuletu is currently undergoing scheduled maintenance.",
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <div className="max-w-md w-full space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-center space-x-4 text-primary opacity-80">
          <Wrench className="h-12 w-12 animate-pulse" />
          <HardHat className="h-12 w-12" />
          <Cog className="h-12 w-12 animate-spin-slow" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            We'll be back soon!
          </h1>
          <p className="text-lg text-muted-foreground">
            Kapuletu is currently undergoing scheduled maintenance to bring you new features and
            improvements.
          </p>
          <div className="pt-8">
            <p className="text-sm font-medium text-muted-foreground bg-muted p-4 rounded-lg border border-border shadow-sm">
              Expected downtime is usually less than an hour. Thank you for your patience! 🛠️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
