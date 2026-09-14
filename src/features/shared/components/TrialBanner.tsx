"use client";

import { AlertTriangle, Clock, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { useGetMySubscriptionQuery } from "@/features/auth/services/queries";

export const TrialBanner = () => {
  const { data, isLoading } = useGetMySubscriptionQuery();

  if (isLoading || !data) return null;

  // Show banner if they are on trial, OR if their trial has just expired (to encourage upgrade)
  // Our backend logic downgrades them to Free when expired, so they won't be "on_trial" anymore technically
  // but we might want to check days_remaining or handle that gracefully.
  // We'll rely on is_on_trial for the active trial, and if we want to handle expired we can check usage limits later.
  if (!data.is_on_trial) return null;

  const { days_remaining } = data;

  // Choose styling based on urgency
  const isUrgent = days_remaining <= 7;
  const isExpired = days_remaining <= 0;

  if (isExpired) {
    return (
      <div className="w-full bg-destructive/15 border border-destructive/30 rounded-lg p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-destructive/20 rounded-full shrink-0">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h4 className="font-semibold text-destructive">Pro Trial Expired</h4>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your 21-day trial has ended and you've been downgraded to the Free tier. Upgrade to
              restore premium features.
            </p>
          </div>
        </div>
        <Link href="/subscriptions" className="shrink-0">
          <Button variant="destructive" size="sm" className="whitespace-nowrap">
            Upgrade Now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`w-full border rounded-lg p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isUrgent ? "bg-amber-500/10 border-amber-500/30" : "bg-primary/10 border-primary/20"}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-full shrink-0 ${isUrgent ? "bg-amber-500/20 text-amber-600" : "bg-primary/20 text-primary"}`}
        >
          {isUrgent ? <Clock className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
        </div>
        <div>
          <h4
            className={`font-semibold ${isUrgent ? "text-amber-700 dark:text-amber-500" : "text-primary"}`}
          >
            Pro Trial Active
          </h4>
          <p className="text-sm text-muted-foreground mt-0.5">
            You have{" "}
            <strong className={isUrgent ? "text-amber-700 dark:text-amber-500" : "text-foreground"}>
              {days_remaining} {days_remaining === 1 ? "day" : "days"}
            </strong>{" "}
            left in your free trial of the Professional plan.
          </p>
        </div>
      </div>
      <Link href="/subscriptions" className="shrink-0">
        <Button
          variant={isUrgent ? "default" : "outline"}
          size="sm"
          className={
            isUrgent
              ? "bg-amber-600 hover:bg-amber-700 text-white border-none"
              : "border-primary/50 hover:bg-primary/10"
          }
        >
          View Plans
        </Button>
      </Link>
    </div>
  );
};
