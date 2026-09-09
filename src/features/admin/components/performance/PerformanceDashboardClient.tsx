"use client";

import {
  useExtendedActiveUsersQuery,
  usePerformanceActivityQuery,
  usePerformanceEventsQuery,
  usePerformanceMetricsQuery,
} from "@/features/admin/services/queries";
import PageLayout from "@/features/shared/components/PageLayout";
import { ActivityTrendChart } from "./ActivityTrendChart";
import { EnhancedActiveUsers } from "./EnhancedActiveUsers";
import { SystemEventsTable } from "./SystemEventsTable";
import { SystemHealthCards } from "./SystemHealthCards";

export const PerformanceDashboardClient = () => {
  const { data: healthData, isLoading: healthLoading } = usePerformanceMetricsQuery();
  const { data: activityData, isLoading: activityLoading } = usePerformanceActivityQuery();
  const { data: usersData, isLoading: usersLoading } = useExtendedActiveUsersQuery();
  const { data: eventsData, isLoading: eventsLoading } = usePerformanceEventsQuery();

  return (
    <PageLayout
      title="Platform Performance"
      subtitle="Monitor real-time system health, active users, and critical platform events."
    >
      <div className="space-y-6">
        <SystemHealthCards data={healthData} isLoading={healthLoading} />

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityTrendChart data={activityData} isLoading={activityLoading} />
          </div>
          <EnhancedActiveUsers data={usersData} isLoading={usersLoading} />
        </div>

        <SystemEventsTable data={eventsData} isLoading={eventsLoading} />
      </div>
    </PageLayout>
  );
};
