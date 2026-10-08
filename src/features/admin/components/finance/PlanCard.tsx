import Link from "next/link";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminFinancePlanItem } from "@/features/admin/services/queries";
import { cn, formatKes } from "@/lib/utils";

interface PlanCardProps {
  plan: AdminFinancePlanItem;
}

const limit = (n: number) => (n >= 9999 ? "Unlimited" : new Intl.NumberFormat("en-KE").format(n));

export const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  const archived = !!plan.archived_at;
  return (
    <Card className={cn("flex flex-col", archived && "opacity-70")}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          <div className="flex gap-1">
            {archived && <Badge variant="outline">Archived</Badge>}
            {!archived && !plan.is_public && <Badge variant="outline">Hidden</Badge>}
          </div>
        </div>
        <CardDescription>
          <span className="font-mono">{plan.code}</span> · {plan.active_subscribers} active{" "}
          {plan.active_subscribers === 1 ? "subscription" : "subscriptions"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div>
          <div className="text-3xl font-bold tabular-nums">
            {formatKes(plan.monthly_price)}
            <span className="text-sm text-muted-foreground font-normal"> / month</span>
          </div>
          <p className="text-sm text-muted-foreground tabular-nums">
            {formatKes(plan.annual_price)} / year
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-2 text-sm flex-1">
          <div>
            <dt className="text-muted-foreground">Groups</dt>
            <dd className="font-medium">{limit(plan.max_groups)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Campaigns</dt>
            <dd className="font-medium">{limit(plan.max_campaigns)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Contributions / mo</dt>
            <dd className="font-medium">{limit(plan.max_transactions)}</dd>
          </div>
        </dl>
        <Button
          variant="outline"
          className="w-full"
          nativeButton={false}
          render={<Link href={`/admin/finance/plans/${plan.plan_id}`} />}
        >
          Edit plan
        </Button>
      </CardContent>
    </Card>
  );
};
