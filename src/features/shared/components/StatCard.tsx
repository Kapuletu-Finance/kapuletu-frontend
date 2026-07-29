import type * as React from "react";
import { Card } from "@/components/ui/card";
import IconLibrary, { type IconName } from "@/features/shared/components/IconLibrary";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  count: string | number;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  iconName: IconName;
  className?: string;
  iconClassName?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  count,
  trend,
  trendDirection = "neutral",
  iconName,
  className,
  iconClassName,
}) => {
  return (
    <Card
      className={cn(
        "p-6 flex flex-row items-center justify-between border-none shadow-sm rounded-2xl bg-card",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground font-medium text-sm sm:text-base">{label}</span>
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold text-foreground leading-none">{count}</span>
          {trend && (
            <div className="flex items-center gap-1 text-xs mt-1 font-medium">
              {trendDirection === "up" && (
                <IconLibrary name="arrow-right" className="w-3 h-3 text-primary -rotate-45" />
              )}
              {trendDirection === "down" && (
                <IconLibrary name="arrow-right" className="w-3 h-3 text-destructive rotate-45" />
              )}
              <span
                className={cn(
                  trendDirection === "up" && "text-primary",
                  trendDirection === "down" && "text-destructive",
                  trendDirection === "neutral" && "text-muted-foreground",
                )}
              >
                {trend}
              </span>
            </div>
          )}
        </div>
      </div>
      <div
        className={cn(
          "w-14 h-14 rounded-md flex items-center justify-center shrink-0 shadow-sm",
          iconClassName || "bg-primary text-primary-foreground",
        )}
      >
        <IconLibrary name={iconName} className="w-6 h-6" />
      </div>
    </Card>
  );
};

export default StatCard;
