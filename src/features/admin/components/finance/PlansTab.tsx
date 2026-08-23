import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminFinancePlansQuery } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { CreatePlanSheet } from "./CreatePlanSheet";
import { PlanCard } from "./PlanCard";

export const PlansTab: React.FC = () => {
  const { data: plans, isLoading, error } = useAdminFinancePlansQuery();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">Subscription Plans</h3>
        <Button onClick={() => setIsSheetOpen(true)} className="gap-2">
          <IconLibrary name="add-circle" className="size-4" />
          Create Plan
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            <Skeleton key={`skeleton-plan-${i}`} className="h-[200px] w-full rounded-xl" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive">Failed to load plans. Please try again.</div>
      )}

      {plans && plans.length === 0 && !isLoading && (
        <div className="text-sm text-muted-foreground text-center py-8">
          No subscription plans found.
        </div>
      )}

      {plans && plans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.plan_id} plan={plan} />
          ))}
        </div>
      )}

      <CreatePlanSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  );
};
