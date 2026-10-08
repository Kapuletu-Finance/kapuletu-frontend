"use client";

import type React from "react";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { EmployeeProfile } from "@/features/admin/services/employeeProfile";
import { useEmployeeMetricsQuery } from "@/features/admin/services/queries";
import { AttendanceSummaryStats } from "@/features/hr/components/shared/AttendanceSummaryStats";
import { useAttendanceReportQuery } from "@/features/hr/services/queries";
import type { AttendanceReportParams } from "@/features/hr/types";
import { formatRole, toDateParam } from "@/features/hr/utils";

const chartConfig = {
  actions: { color: "var(--primary)", label: "Actions" },
} satisfies ChartConfig;

const Fact: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between gap-4 border-b py-2 text-sm last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-medium">{value}</span>
  </div>
);

const formatDateTime = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : "—");

export const EmployeeOverviewTab: React.FC<{ employee: EmployeeProfile }> = ({ employee }) => {
  // Same key as the Attendance tab's current month, so the data is shared from the cache.
  const params = useMemo<AttendanceReportParams>(
    () => ({ anchor: toDateParam(new Date()), period: "month", user_id: employee.user_id }),
    [employee.user_id],
  );
  const { data: report } = useAttendanceReportQuery(params);
  const { data: metrics } = useEmployeeMetricsQuery(employee.user_id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">This month</h2>
        {report ? (
          <AttendanceSummaryStats summary={report.totals} detailed />
        ) : (
          <Skeleton className="h-48 w-full" />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Platform activity · last 7 days</CardTitle>
            <CardDescription>
              {metrics
                ? `${metrics.total_actions_performed} recorded actions in total`
                : "Loading…"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metrics ? (
              <ChartContainer config={chartConfig} className="h-56 w-full">
                <BarChart data={metrics.activity_trend} margin={{ left: -16, right: 8, top: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="actions" fill="var(--color-actions)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <Skeleton className="h-56 w-full" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Fact label="Role" value={formatRole(employee.role)} />
            <Fact label="Status" value={employee.is_active ? "Active" : "Suspended"} />
            <Fact
              label="Joined"
              value={employee.created_at ? new Date(employee.created_at).toLocaleDateString() : "—"}
            />
            <Fact label="Last sign-in" value={formatDateTime(employee.last_login_at)} />
            <Fact label="Last active" value={formatDateTime(employee.last_active_at)} />
            <Fact label="Two-factor auth" value={employee.two_factor_enabled ? "Enabled" : "Off"} />
            <Fact
              label="Sessions last revoked"
              value={formatDateTime(employee.sessions_revoked_at)}
            />
            <Fact label="Permissions" value={employee.permissions.length} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
