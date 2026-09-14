"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { AdminOverviewResponse } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn } from "@/lib/utils";

interface KpiCardsProps {
  data?: AdminOverviewResponse["kpis"];
  isLoading: boolean;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ data, isLoading }) => {
  const cards = [
    {
      title: "Total Treasurers",
      value: data?.total_treasurers ?? 0,
      icon: "group" as const,
      subValue: `${data?.active_treasurers ?? 0} active`,
    },
    {
      title: "Total Revenue",
      value: `KES ${(data?.total_revenue_kes ?? 0).toLocaleString()}`,
      icon: "credit-card" as const,
      subValue: "All-time",
    },
    {
      title: "Active Subscriptions",
      value: data?.active_subscriptions ?? 0,
      icon: "badge-check" as const,
      subValue: `of ${data?.total_treasurers ?? 0}`,
    },
    {
      title: "Open Tickets",
      value: data?.pending_tickets ?? 0,
      icon: "ticket" as const,
      subValue: "In support queue",
    },
    {
      title: "AI Accuracy",
      value: `${((data?.ai_accuracy_rate ?? 0) * 100).toFixed(0)}%`,
      icon: "brain" as const,
      subValue: "Parser confidence",
    },
    {
      title: "Feedback",
      value: data?.total_feedback ?? 0,
      icon: "feedback" as const,
      subValue: `${data?.new_feedback ?? 0} new`,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title} className={cn("overflow-hidden", isLoading && "animate-pulse")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <IconLibrary name={card.icon} className="size-6" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    {isLoading ? "..." : card.value}
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground">
                    {isLoading ? "" : card.subValue}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
