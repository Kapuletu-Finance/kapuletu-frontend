"use client";

import Link from "next/link";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminFinancePlansQuery } from "@/features/admin/services/queries";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { PlanCard } from "./PlanCard";

export const PlansPage: React.FC = () => {
  const { data: plans, isLoading, error } = useAdminFinancePlansQuery();
  const active = plans?.filter((p) => !p.archived_at) ?? [];
  const archived = plans?.filter((p) => p.archived_at) ?? [];

  return (
    <PageLayout
      title="Plans & pricing"
      subtitle="Price changes apply to new checkouts and renewals; invoices already issued keep their price."
      actionButton={
        <Button nativeButton={false} render={<Link href="/admin/finance/plans/create" />}>
          New plan
        </Button>
      }
    >
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {["a", "b", "c"].map((k) => (
            <Skeleton key={k} className="h-[260px] w-full rounded-xl" />
          ))}
        </div>
      )}
      {error && <p className="text-sm text-destructive">Failed to load plans. Please try again.</p>}
      {plans && plans.length === 0 && (
        <p className="text-sm text-muted-foreground">No plans yet.</p>
      )}

      {active.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.map((plan) => (
            <PlanCard key={plan.plan_id} plan={plan} />
          ))}
        </div>
      )}

      {archived.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Archived</h2>
          <p className="text-sm text-muted-foreground">
            Not for sale. Existing subscribers keep them until their period ends.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archived.map((plan) => (
              <PlanCard key={plan.plan_id} plan={plan} />
            ))}
          </div>
        </section>
      )}
    </PageLayout>
  );
};
