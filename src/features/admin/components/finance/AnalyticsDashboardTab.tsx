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
import { useAdminFinancialHealthQuery } from "@/features/admin/services/queries";
import { CohortRetentionTable } from "./charts/CohortRetentionTable";
import { RevenueFlowChart } from "./charts/RevenueFlowChart";
import { ExportModal } from "./ExportModal";

export const AnalyticsDashboardTab: React.FC = () => {
  const [interval, setInterval] = useState<"month" | "week">("month");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const { data: healthMetrics, isLoading: isHealthLoading } = useAdminFinancialHealthQuery();

  return (
    <div className="space-y-6">
      {/* Glassmorphic Control Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-background/60 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-sm gap-4">
        <div>
          <h3 className="font-semibold text-lg tracking-tight">Financial Overview</h3>
          <p className="text-sm text-muted-foreground">Monitor revenue health and trends.</p>
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
            onClick={() => setIsExportModalOpen(true)}
            className="bg-primary text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />

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
