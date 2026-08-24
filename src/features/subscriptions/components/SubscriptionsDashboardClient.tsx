"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useGetBillingHistoryQuery,
  useGetMySubscriptionQuery,
  useGetSettingsQuery,
} from "@/features/auth/services/queries";
import { PricingSection } from "@/features/landing-page/components/PricingSection";
import IconLibrary from "@/features/shared/components/IconLibrary";
import PageLayout from "@/features/shared/components/PageLayout";
import { BillingHistoryTable } from "./BillingHistoryTable";
import { BillingSettingsCard } from "./BillingSettingsCard";
import { SubscriptionOverviewCard } from "./SubscriptionOverviewCard";

export const SubscriptionsDashboardClient = () => {
  const { data: subscription, isLoading: isSubLoading } = useGetMySubscriptionQuery();
  const { data: history, isLoading: isHistoryLoading } = useGetBillingHistoryQuery();
  const { data: settings, isLoading: isSettingsLoading } = useGetSettingsQuery();
  const [showPlans, setShowPlans] = useState(false);

  const isLoading = isSubLoading || isHistoryLoading || isSettingsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load subscription data.</p>
      </div>
    );
  }

  const isActivePlan = subscription.active_plan.toLowerCase() !== "free";

  return (
    <PageLayout
      title="Billing & Subscriptions"
      subtitle="Manage your plan, quotas, and payment history."
      actionButton={
        <Button
          onClick={() => setShowPlans(!showPlans)}
          variant={showPlans ? "outline" : "default"}
        >
          {showPlans ? (
            <>
              <IconLibrary name="close" className="w-4 h-4 mr-2" /> Hide Plans
            </>
          ) : (
            <>
              <IconLibrary name="trending-up" className="w-4 h-4 mr-2" /> Upgrade Plan
            </>
          )}
        </Button>
      }
    >
      {showPlans && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300 border-b border-border pb-8 mb-8">
          <PricingSection currentPlan={subscription.active_plan} isLoggedIn={true} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <SubscriptionOverviewCard subscription={subscription} />
          <BillingHistoryTable history={history || []} />
        </div>
        <div className="space-y-8">
          <BillingSettingsCard billingSettings={settings?.billing} isActivePlan={isActivePlan} />

          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
              <IconLibrary name="help" className="w-4 h-4 text-primary" /> Need Help?
            </h4>
            <p className="text-sm text-muted-foreground">
              If you have any issues with your billing or would like to request a refund, please
              contact our support team.
            </p>
            <Button variant="link" className="px-0 mt-2 h-auto text-primary">
              Contact Support &rarr;
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
