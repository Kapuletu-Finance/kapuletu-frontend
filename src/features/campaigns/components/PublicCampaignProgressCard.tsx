"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IconLibrary from "@/features/shared/components/IconLibrary";
import type { PublicWebReportOut } from "@/features/shared/types";
import { useConfetti } from "@/hooks/useConfetti";

interface PublicCampaignProgressCardProps {
  report: PublicWebReportOut;
}

const PublicCampaignProgressCard: React.FC<PublicCampaignProgressCardProps> = ({ report }) => {
  const progress = report.progress_percentage;
  const isGoalMet = progress >= 100;
  const { fireConfetti } = useConfetti();

  useEffect(() => {
    if (isGoalMet) {
      fireConfetti();
    }
  }, [isGoalMet, fireConfetti]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-foreground font-sans">Progress</CardTitle>
      </CardHeader>

      <CardContent className="flex items-center justify-center h-75">
        <div className="flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-2xl">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <title>Progress Ring</title>
              <path
                className="text-secondary"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`text-primary transition-all duration-1000 ease-out ${isGoalMet ? "drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]" : ""}`}
                strokeDasharray={`${Math.min(progress, 100)}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center flex flex-col items-center">
              {isGoalMet ? (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                  <IconLibrary name="badge-check" className="w-10 h-10 text-primary mb-1" />
                  <span className="text-xl font-bold text-foreground tracking-tight leading-none text-center">
                    Target
                    <br />
                    Met!
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-4xl font-extrabold text-foreground tracking-tight">
                    {`${Math.round(progress)}%`}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                    Raised
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicCampaignProgressCard;
