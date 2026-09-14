"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminOverviewResponse } from "@/features/admin/services/queries";
import { cn } from "@/lib/utils";

interface RevenueTrendProps {
  data?: AdminOverviewResponse["revenue_trend"];
  isLoading: boolean;
}

export const RevenueTrend: React.FC<RevenueTrendProps> = ({ data, isLoading }) => {
  // Use a pure CSS bar chart since no charting library is available
  const maxAmount = data && data.length > 0 ? Math.max(...data.map((d) => d.amount)) : 0;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Revenue Trend (30d)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end pt-0 pb-6 px-6">
        {isLoading ? (
          <div className="h-40 w-full animate-pulse bg-muted rounded-md" />
        ) : !data || data.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-border">
            <span className="text-sm text-muted-foreground">No data available</span>
          </div>
        ) : (
          <div className="flex h-40 items-end justify-between gap-1 mt-auto">
            {data.map((point) => {
              const heightPercent = maxAmount > 0 ? (point.amount / maxAmount) * 100 : 0;
              const isZero = point.amount === 0;

              // Format date from YYYY-MM-DD to just D or MMM D for tooltip
              const dateObj = new Date(point.date);
              const label = dateObj.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={point.date}
                  className="group relative flex w-full flex-col items-center justify-end"
                  style={{ height: "100%" }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 flex-col items-center group-hover:flex z-10">
                    <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-sm">
                      <p className="font-semibold">{label}</p>
                      <p>KES {point.amount.toLocaleString()}</p>
                    </div>
                    <div className="h-1 w-1 -translate-y-1/2 rotate-45 bg-foreground" />
                  </div>

                  {/* Bar */}
                  <div
                    className={cn(
                      "w-full rounded-t-sm transition-all duration-300 hover:opacity-80",
                      isZero ? "bg-muted h-1" : "bg-primary",
                    )}
                    style={{ height: isZero ? "4px" : `${Math.max(heightPercent, 2)}%` }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
