"use client";

import { Activity, FileSpreadsheet, Loader2, TrendingUp, Users } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
// Make sure to import the mutation from where you defined it (assuming queries or mutations)
// Let's assume it was exported from queries.ts or mutations.ts
import { useExportFinancialDataMutation as useExport } from "@/features/admin/services/mutations";
import { useAdminFinancialHealthQuery } from "@/features/admin/services/queries";
import { CohortRetentionTable } from "./charts/CohortRetentionTable";
import { RevenueFlowChart } from "./charts/RevenueFlowChart";

export const AnalyticsDashboardTab: React.FC = () => {
  const [interval, setInterval] = useState<"month" | "week">("month");
  const { data: healthMetrics, isLoading: isHealthLoading } = useAdminFinancialHealthQuery();
  const exportMutation = useExport();

  const handleExport = () => {
    exportMutation.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Glassmorphic Control Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-background/60 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-sm gap-4">
        <div>
          <h3 className="font-semibold text-lg tracking-tight">Financial Command Center</h3>
          <p className="text-sm text-muted-foreground">
            Monitor real-time revenue health and trends.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={interval}
            onValueChange={(val: "week" | "month" | null) => val && setInterval(val)}
          >
            <SelectTrigger className="w-[150px] bg-background">
              <SelectValue placeholder="Select Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly View</SelectItem>
              <SelectItem value="month">Monthly View</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleExport}
            disabled={exportMutation.isPending}
            className="bg-primary text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all"
          >
            {exportMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="mr-2 h-4 w-4" />
            )}
            Export Financial Data
          </Button>
        </div>
      </div>

      {/* KPI Sparkline Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* MRR Card */}
        <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium flex items-center justify-between">
              Monthly Recurring Revenue (MRR)
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {isHealthLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                `Ksh. ${((healthMetrics?.mrr || 0) / 1000).toFixed(1)}k`
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-emerald-500 font-medium">+12.5% from last month</div>
          </CardContent>
          {/* Decorative Background Element */}
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-32 h-32" />
          </div>
        </Card>

        {/* Active Subscribers Card */}
        <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium flex items-center justify-between">
              Active Subscriptions
              <Users className="h-4 w-4 text-blue-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {isHealthLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                healthMetrics?.active_subscribers || 0
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-500 font-medium">+42 new this month</div>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-32 h-32" />
          </div>
        </Card>

        {/* Churn Rate Card */}
        <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium flex items-center justify-between">
              30-Day Churn Rate
              <Activity className="h-4 w-4 text-rose-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {isHealthLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                `${healthMetrics?.churn_rate_percent || 0}%`
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground font-medium">
              Industry standard is ~5%
            </div>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="w-32 h-32" />
          </div>
        </Card>
      </div>

      {/* Main Charts Area */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        <RevenueFlowChart interval={interval} />
      </div>

      {/* Retention Table */}
      <div className="grid gap-6 grid-cols-1">
        <CohortRetentionTable />
      </div>
    </div>
  );
};
