import { format } from "date-fns";
import Link from "next/link";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SubscriptionResponse } from "@/features/auth/types";

interface Props {
  subscription: SubscriptionResponse;
  isPaidPlan: boolean;
}

/**
 * How renewal works. Plans don't renew by themselves (there is no saved card or M-Pesa standing order),
 * so this explains what happens instead of offering an auto-renew switch that did nothing.
 */
export const BillingSettingsCard: React.FC<Props> = ({ subscription, isPaidPlan }) => {
  const ends = subscription.expiry_date
    ? format(new Date(subscription.expiry_date), "d MMMM yyyy")
    : null;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Renewal</CardTitle>
        <CardDescription>
          Plans are paid one period at a time; nothing is charged automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {isPaidPlan && ends ? (
          <>
            <p>
              Your <strong>{subscription.active_plan}</strong> plan ends on <strong>{ends}</strong>
              {subscription.is_on_trial ? " (free trial)" : ""}.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>We email you 7, 3 and 1 day before it ends.</li>
              <li>Pay before then to keep going; the new period starts when this one ends.</li>
              <li>
                If it lapses, you keep access for a short grace period, then move to Basic. Your
                data stays.
              </li>
            </ul>
            <Button
              className="w-full"
              nativeButton={false}
              render={<Link href={`/checkout?tier=${subscription.plan_code ?? ""}`} />}
            >
              {subscription.is_on_trial ? "Choose a plan" : "Renew now"}
            </Button>
          </>
        ) : (
          <p className="text-muted-foreground">
            You're on the free Basic plan. Upgrade any time; you'll only pay for the period you
            choose.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
