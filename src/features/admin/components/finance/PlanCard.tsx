import type React from "react";
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
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Max {plan.max_groups} Groups</li>
          <li>• Max {plan.max_campaigns} Campaigns</li>
          <li>• Max {plan.max_transactions} Transactions/mo</li>
        </ul>
      </CardContent>
    </Card>
  );
};
