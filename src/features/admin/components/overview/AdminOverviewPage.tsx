"use client";

import { Button } from "@/components/ui/button";
import { useAdminOverviewQuery } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { ActiveUsersTracker } from "./ActiveUsersTracker";
import { KpiCards } from "./KpiCards";
import { RecentGroups } from "./RecentGroups";
import { RecentPayments } from "./RecentPayments";
import { RecentSignups } from "./RecentSignups";
import { RevenueTrend } from "./RevenueTrend";
import { SubscriptionBreakdown } from "./SubscriptionBreakdown";

export const AdminOverviewPage: React.FC = () => {
  const { data, isLoading, isError, refetch } = useAdminOverviewQuery();

  if (isError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4 rounded-lg border border-dashed border-border p-8 text-center">
        <IconLibrary name="alert" className="size-8 text-destructive/80" />
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-foreground">Failed to load overview data</h3>
          <p className="text-sm text-muted-foreground">
            There was an error connecting to the analytics service.
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <IconLibrary name="refresh" className="mr-2 size-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Platform Overview</h1>
        <p className="text-sm text-muted-foreground">
          High-level statistics and recent activity across KapuLetu.
        </p>
      </div>

      <KpiCards data={data?.kpis} isLoading={isLoading} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueTrend data={data?.revenue_trend} isLoading={isLoading} />
        </div>
        <SubscriptionBreakdown
          subscriptionData={data?.subscription_breakdown}
          feedbackData={data?.feedback_summary}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <ActiveUsersTracker />
        <RecentSignups data={data?.recent_signups} isLoading={isLoading} />
        <RecentPayments data={data?.recent_payments} isLoading={isLoading} />
        <RecentGroups data={data?.recent_groups} isLoading={isLoading} />
      </div>
    </div>
  );
};
