"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicWebReportOut } from "@/features/shared/types";

interface PublicCampaignProgressCardProps {
  report: PublicWebReportOut;
}

const PublicCampaignProgressCard: React.FC<PublicCampaignProgressCardProps> = ({ report }) => {
  const progress = report.progress_percentage;

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
                className="text-primary"
                strokeDasharray={`${Math.min(progress, 100)}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center flex flex-col items-center">
              <span className="text-4xl font-extrabold text-foreground tracking-tight">
                {`${Math.round(progress)}%`}
              </span>
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                Raised
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicCampaignProgressCard;
