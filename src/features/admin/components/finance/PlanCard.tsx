import Link from "next/link";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminFinancePlanItem } from "@/features/admin/services/queries";
import { formatKes } from "@/lib/utils";

interface PlanCardProps {
  plan: AdminFinancePlanItem;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description || "Subscription tier"}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="text-3xl font-bold text-foreground">
          {formatKes(plan.price)}
          <span className="text-sm text-muted-foreground font-normal"> /mo</span>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground flex-1">
          <li>• Max {plan.max_groups} Groups</li>
          <li>• Max {plan.max_campaigns} Campaigns</li>
          <li>• Max {plan.max_transactions} Transactions/mo</li>
        </ul>
        <div className="pt-4">
          <Link href={`/admin/finance/plans/${plan.plan_id}`}>
            <Button variant="outline" className="w-full">
              Edit Plan
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
