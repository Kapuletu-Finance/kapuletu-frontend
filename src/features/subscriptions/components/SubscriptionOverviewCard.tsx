import { format } from "date-fns";
import type React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SubscriptionResponse } from "@/features/auth/types";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface Props {
  subscription: SubscriptionResponse;
}

export const SubscriptionOverviewCard: React.FC<Props> = ({ subscription }) => {
  const isFree = subscription.active_plan.toLowerCase() === "free";

  let percentageLeft = 100;
  let formattedDate = "N/A";

  if (subscription.expiry_date) {
    const totalDays = 30; // Approximation for the progress bar visual
    const remaining = subscription.days_remaining;
    percentageLeft = Math.max(0, Math.min(100, (remaining / totalDays) * 100));
    formattedDate = format(new Date(subscription.expiry_date), "MMMM d, yyyy");
  }

  // Parse usage safely
  const [groupsUsed, groupsTotal] = (subscription.usage?.groups || "0/0").split("/");
  const [campaignsUsed, campaignsTotal] = (subscription.usage?.campaigns || "0/0").split("/");

  const groupsPercent =
    parseInt(groupsTotal, 10) > 0
      ? (parseInt(groupsUsed, 10) / parseInt(groupsTotal, 10)) * 100
      : 0;
  const campaignsPercent =
    parseInt(campaignsTotal, 10) > 0
      ? (parseInt(campaignsUsed, 10) / parseInt(campaignsTotal, 10)) * 100
      : 0;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              Current Plan
              {subscription.is_on_trial && (
                <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full font-medium">
                  Trial Active
                </span>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              You are currently on the{" "}
              <strong className="text-foreground">{subscription.active_plan}</strong> plan.
            </CardDescription>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl">
            <IconLibrary name="credit-card" className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isFree && subscription.expiry_date && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time Remaining</span>
              <span className="font-medium">
                {subscription.days_remaining} days left (Renews {formattedDate})
              </span>
            </div>
            <Progress value={percentageLeft} className="h-2" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <IconLibrary name="group" className="w-4 h-4" /> Groups Quota
              </span>
              <span className="font-medium">
                {groupsUsed} / {groupsTotal === "unlimited" ? "∞" : groupsTotal}
              </span>
            </div>
            <Progress
              value={groupsTotal === "unlimited" ? 100 : groupsPercent}
              className="h-2 bg-secondary"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <IconLibrary name="target" className="w-4 h-4" /> Campaigns Quota
              </span>
              <span className="font-medium">
                {campaignsUsed} / {campaignsTotal === "unlimited" ? "∞" : campaignsTotal}
              </span>
            </div>
            <Progress
              value={campaignsTotal === "unlimited" ? 100 : campaignsPercent}
              className="h-2 bg-secondary"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
