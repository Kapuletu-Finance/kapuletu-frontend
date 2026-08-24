import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SystemHealthKPIs } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface Props {
  data?: SystemHealthKPIs;
  isLoading: boolean;
}

export const SystemHealthCards: React.FC<Props> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground tracking-tight">
              System Uptime
            </h3>
            <IconLibrary name="check-circle" className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{data.uptime_percent.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground tracking-tight">
              Avg Response Time
            </h3>
            <IconLibrary name="clock" className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{data.avg_response_time_ms}ms</div>
            <p className="text-xs text-muted-foreground mt-1">Across all API endpoints</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground tracking-tight">
              Server Load (Simulated)
            </h3>
            <IconLibrary name="server" className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{data.cpu_load_percent}%</div>
            <p className="text-xs text-muted-foreground mt-1">CPU/Memory proxy</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground tracking-tight">Error Rate</h3>
            <IconLibrary
              name="alert"
              className={`h-4 w-4 ${data.error_rate_percent > 1 ? "text-destructive" : "text-emerald-500"}`}
            />
          </div>
          <div>
            <div className="text-2xl font-bold">{data.error_rate_percent}%</div>
            <p className="text-xs text-muted-foreground mt-1">Failed requests / Total</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
