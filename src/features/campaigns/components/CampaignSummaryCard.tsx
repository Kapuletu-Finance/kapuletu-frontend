"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCampaignQuery } from "@/features/campaigns/services/queries";
import AddContributionFormDialog from "@/features/contributions/components/AddContributionFormDialog";
import IconLibrary from "@/features/shared/components/IconLibrary";

const formatCurrency = (value: number) =>
  `Ksh. ${value.toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const CampaignSummaryCard = () => {
  const params = useParams();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";

  const { data: campaign } = useCampaignQuery(campaignSlug);

  const target_amount = campaign?.target_amount ?? 0;
  const total_raised = campaign?.total_raised ?? 0;
  const remaining = Math.max(0, target_amount - total_raised);
  const surplus = campaign?.surplus_amount ?? Math.max(0, total_raised - target_amount);
  const contributor_count = campaign?.contributor_count ?? 0;

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

          {(campaign?.total_mpesa ?? 0) > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconLibrary name="smartphone" className="w-4 h-4" />
                <span>
                  Amount Received <span className="text-primary">(M-Pesa)</span>
                </span>
              </div>
              <span className="font-medium text-foreground">
                {formatCurrency(campaign?.total_mpesa!)}
              </span>
            </div>
          )}

          {(campaign?.total_cash ?? 0) > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconLibrary name="contribution" className="w-4 h-4" />
                <span>
                  Amount Received <span className="text-primary">(Cash)</span>
                </span>
              </div>
              <span className="font-medium text-foreground">
                {formatCurrency(campaign?.total_cash!)}
              </span>
            </div>
          )}

          {(campaign?.total_bank ?? 0) > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconLibrary name="globe" className="w-4 h-4" />
                <span>
                  Amount Received <span className="text-primary">(Bank)</span>
                </span>
              </div>
              <span className="font-medium text-foreground">
                {formatCurrency(campaign?.total_bank!)}
              </span>
            </div>
          )}

          {(campaign?.total_pledges ?? 0) > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconLibrary name="report" className="w-4 h-4" />
                <span>
                  Amount Received <span className="text-primary">(Pledge)</span>
                </span>
              </div>
              <span className="font-medium text-foreground">
                {formatCurrency(campaign?.total_pledges!)}
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
              <span className="font-medium text-muted-foreground">{formatCurrency(remaining)}</span>
            </div>
          )}
        </div>

        <AddContributionFormDialog campaignSlug={campaignSlug}>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-semibold gap-2 mt-8">
            <IconLibrary name="add" className="w-5 h-5" /> Add a contribution
          </Button>
        </AddContributionFormDialog>
      </CardContent>
    </Card>
  );
};

export default CampaignSummaryCard;
