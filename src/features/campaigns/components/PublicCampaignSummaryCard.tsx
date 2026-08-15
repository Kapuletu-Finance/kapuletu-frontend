"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IconLibrary from "@/features/shared/components/IconLibrary";
import type { PublicWebReportOut } from "@/features/shared/types";

const formatCurrency = (value: number) =>
  `Ksh. ${value.toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

interface PublicCampaignSummaryCardProps {
  report: PublicWebReportOut;
}

const PublicCampaignSummaryCard: React.FC<PublicCampaignSummaryCardProps> = ({ report }) => {
  const target_amount = report.target_amount;
  const total_raised = report.raised_amount;
  const remaining = Math.max(0, target_amount - total_raised);
  const contributor_count = report.total_contributors;

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground font-sans">
          Campaign Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-1">
        <div className="space-y-6 flex-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconLibrary name="target" className="w-4 h-4" />
              <span>Goal</span>
            </div>
            <span className="font-semibold text-foreground">{formatCurrency(target_amount)}</span>
          </div>

          {(report.total_mpesa ?? 0) > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconLibrary name="smartphone" className="w-4 h-4" />
                <span>Amount Received (M-Pesa)</span>
              </div>
              <span className="font-medium text-foreground">
                {formatCurrency(report.total_mpesa!)}
              </span>
            </div>
          )}

          {(report.total_cash ?? 0) > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconLibrary name="contribution" className="w-4 h-4" />
                <span>Amount Received (Cash)</span>
              </div>
              <span className="font-medium text-foreground">
                {formatCurrency(report.total_cash!)}
              </span>
            </div>
          )}

          {(report.total_bank ?? 0) > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconLibrary name="globe" className="w-4 h-4" />
                <span>Amount Received (Bank)</span>
              </div>
              <span className="font-medium text-foreground">
                {formatCurrency(report.total_bank!)}
              </span>
            </div>
          )}

          {(report.total_pledges ?? 0) > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconLibrary name="report" className="w-4 h-4" />
                <span>Amount Received (Pledge)</span>
              </div>
              <span className="font-medium text-foreground">
                {formatCurrency(report.total_pledges!)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconLibrary name="credit-card" className="w-4 h-4" />
              <span>Total Contributions</span>
            </div>
            <span className="font-semibold text-foreground">{contributor_count}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconLibrary name="campaign" className="w-4 h-4" />
              <span>Amount Raised</span>
            </div>
            <span className="font-semibold text-foreground">{formatCurrency(total_raised)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconLibrary name="rotate-ccw" className="w-4 h-4" />
              <span>Amount Remaining</span>
            </div>
            <span className="font-semibold text-foreground">{formatCurrency(remaining)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicCampaignSummaryCard;
