"use client";

import { Skeleton } from "@/components/ui/skeleton";
import GroupsSection from "@/features/treasurer/components/GroupsSection";
import OverviewSection from "@/features/treasurer/components/OverviewSection";
import QuickActionsSection from "@/features/treasurer/components/QuickActionsSection";
import RecentActivitiesSection from "@/features/treasurer/components/RecentActivitiesSection";
import { useWorkspaceOverviewQuery } from "@/features/treasurer/services/queries";

const TreasurerPage = () => {
  const { data: overview, isLoading } = useWorkspaceOverviewQuery();

  return (
    <>
      <QuickActionsSection />
      {isLoading ? (
        <section className="space-y-4 mt-8">
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        </section>
      ) : (
        <OverviewSection overview={overview} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <GroupsSection />
        <RecentActivitiesSection />
      </div>
    </>
  );
};

export default TreasurerPage;
