import type React from "react";
import { Badge } from "@/components/ui/badge";
import PublicCampaignReportBottom from "@/features/campaigns/components/PublicCampaignReportBottom";
import { SiteLogo } from "@/features/shared/components/SiteLogo";
import { ThemeToggle } from "@/features/shared/components/ThemeToggle";

interface CampaignReportLayoutProps {
  children: React.ReactNode;
}

const CampaignReportLayout: React.FC<CampaignReportLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/20 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute top-0 inset-x-0 h-125 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="w-full border-b border-border/40 relative z-10">
        <div className="w-full flex items-center justify-between p-5 sm:px-10 max-w-7xl mx-auto">
          <div className="flex flex-col items-center sm:items-end">
            <SiteLogo variant="full" width={36} height={36} textClassName="text-2xl sm:text-3xl" />
            <span className="text-[10px] sm:text-xs font-bold text-primary tracking-wide -mt-1 sm:-mt-1.5 opacity-90 pr-1">
              Built for Group Finance
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Badge
              variant="outline"
              className="rounded-full font-medium border-primary/40 text-primary bg-primary/10 hover:bg-primary/15 shadow-none px-5 py-1.5 text-sm transition-colors"
            >
              Campaign portal
            </Badge>
            <ThemeToggle className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-9 w-9" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-4 sm:p-6 z-10 w-full mb-20 max-w-7xl mx-auto">
        <div className="w-full flex flex-col items-center gap-12 sm:gap-20">
          {children}

          <div className="w-full max-w-6xl mx-auto bg-card border border-border/60 shadow-md rounded-[2rem] overflow-hidden">
            <PublicCampaignReportBottom />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampaignReportLayout;
