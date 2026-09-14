"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminOverviewResponse } from "@/features/admin/services/queries";
import { cn } from "@/lib/utils";

interface SubscriptionBreakdownProps {
  subscriptionData?: AdminOverviewResponse["subscription_breakdown"];
  feedbackData?: AdminOverviewResponse["feedback_summary"];
  isLoading: boolean;
}

export const SubscriptionBreakdown: React.FC<SubscriptionBreakdownProps> = ({
  subscriptionData,
  feedbackData,
  isLoading,
}) => {
  const totalSubs = subscriptionData?.reduce((acc, curr) => acc + curr.count, 0) || 1; // avoid /0

  const FEEDBACK_COLORS: Record<string, string> = {
    new: "bg-primary/10 text-primary border-primary/20",
    reviewing: "bg-burnt-amber/10 text-burnt-amber border-burnt-amber/20",
    planned: "bg-refined-blue/10 text-refined-blue border-refined-blue/20",
    in_progress: "bg-burnt-amber/10 text-burnt-amber border-burnt-amber/20",
    shipped: "bg-primary/10 text-primary border-primary/20",
    declined: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Subscriptions */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Active Subscriptions
          </h4>
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse bg-muted rounded" />
              <div className="h-4 w-3/4 animate-pulse bg-muted rounded" />
            </div>
          ) : !subscriptionData || subscriptionData.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active subscriptions.</p>
          ) : (
            <div className="space-y-3">
              {subscriptionData.map((item) => {
                const percent = Math.round((item.count / totalSubs) * 100);
                return (
                  <div key={item.plan} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{item.plan}</span>
                      <span className="text-muted-foreground">
                        {item.count} <span className="text-xs">({percent}%)</span>
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="h-px w-full bg-border" />

        {/* Feedback */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Feedback Status
          </h4>
          {isLoading ? (
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse bg-muted rounded-full" />
              <div className="h-6 w-16 animate-pulse bg-muted rounded-full" />
            </div>
          ) : !feedbackData ? (
            <p className="text-sm text-muted-foreground">No feedback data.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Object.entries(feedbackData).map(([status, count]) => {
                if (count === 0) return null;
                const label = status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
                return (
                  <Badge
                    key={status}
                    variant="outline"
                    className={cn("text-xs", FEEDBACK_COLORS[status])}
                  >
                    {count} {label}
                  </Badge>
                );
              })}
              {Object.values(feedbackData).every((v) => v === 0) && (
                <p className="text-sm text-muted-foreground">All queues empty.</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
