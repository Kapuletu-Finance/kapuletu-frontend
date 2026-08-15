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
  const surplus = report.surplus_amount ?? Math.max(0, total_raised - target_amount);
  const contributor_count = report.total_contributors;

  return (
    <Card className="h-full flex flex-col justify-between bg-primary/5 border-primary/10">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground font-sans">
          Campaign Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 p-6">
        <div className="flex flex-col space-y-8 flex-1">
          {/* HERO SECTION */}
          <div className="flex flex-col items-center justify-center text-center space-y-1">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Goal: {formatCurrency(target_amount)}
            </span>
            <span className="text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
              {formatCurrency(total_raised)}
            </span>
          </div>

          {/* LIST VIEW (PAYMENT METHODS) */}
          <div className="flex flex-col space-y-4">
            {(report.total_mpesa ?? 0) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconLibrary name="smartphone" className="w-4 h-4" />
                  <span>
                    Amount Received <span className="text-primary">(M-Pesa)</span>
                  </span>
                </div>
                <span className="font-medium text-foreground">
                  {formatCurrency(report.total_mpesa ?? 0)}
                </span>
              </div>
            )}

            {(report.total_cash ?? 0) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconLibrary name="contribution" className="w-4 h-4" />
                  <span>
                    Amount Received <span className="text-primary">(Cash)</span>
                  </span>
                </div>
                <span className="font-medium text-foreground">
                  {formatCurrency(report.total_cash ?? 0)}
                </span>
              </div>
            )}

            {(report.total_bank ?? 0) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconLibrary name="globe" className="w-4 h-4" />
                  <span>
                    Amount Received <span className="text-primary">(Bank)</span>
                  </span>
                </div>
                <span className="font-medium text-foreground">
                  {formatCurrency(report.total_bank ?? 0)}
                </span>
              </div>
            )}

            {(report.total_pledges ?? 0) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconLibrary name="report" className="w-4 h-4" />
                  <span>
                    Amount Received <span className="text-primary">(Pledge)</span>
                  </span>
                </div>
                <span className="font-medium text-foreground">
                  {formatCurrency(report.total_pledges ?? 0)}
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
              <span className="font-bold text-primary">{formatCurrency(total_raised)}</span>
            </div>

            {surplus > 0 ? (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-primary">
                  <IconLibrary name="trending-up" className="w-4 h-4" />
                  <span className="font-medium">Surplus Raised</span>
                </div>
                <span className="font-bold text-primary">{formatCurrency(surplus)}</span>
              </div>
            ) : (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconLibrary name="rotate-ccw" className="w-4 h-4" />
                  <span>Amount Remaining</span>
                </div>
                <span className="font-medium text-muted-foreground">
                  {formatCurrency(remaining)}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicCampaignSummaryCard;
