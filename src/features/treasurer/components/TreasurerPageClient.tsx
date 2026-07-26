"use client";

import { Skeleton } from "@/components/ui/skeleton";
import CardWithIcon from "@/features/shared/components/CardWithIcon";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { useWorkspaceOverviewQuery } from "@/features/treasurer/services/queries";
import GroupsSection from "./GroupsSection";
import OverviewSection from "./OverviewSection";
import QuickActionsSection from "./QuickActionsSection";
import RecentActivitiesSection from "./RecentActivitiesSection";

const OverviewSkeleton = () => (
  <section className="space-y-4 mt-8">
    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">OVERVIEW</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CardWithIcon
        label="Total number of groups"
        value={<Skeleton className="h-7 w-12 rounded-md" />}
        icon={<IconLibrary name="group" className="w-5 h-5 text-primary-foreground" />}
      />
      <CardWithIcon
        label="Active campaigns"
        value={<Skeleton className="h-7 w-12 rounded-md" />}
        icon={<IconLibrary name="check-circle" className="w-5 h-5 text-primary-foreground" />}
      />
      <CardWithIcon
        label="Active groups"
        value={<Skeleton className="h-7 w-12 rounded-md" />}
        icon={<IconLibrary name="badge-check" className="w-5 h-5 text-primary-foreground" />}
      />
      <CardWithIcon
        label="Pending approvals"
        value={<Skeleton className="h-7 w-12 rounded-md" />}
        icon={<IconLibrary name="clock" className="w-5 h-5 text-primary-foreground" />}
      />
    </div>
  </section>
);

const TreasurerPageClient = () => {
  const { data: overview, isLoading } = useWorkspaceOverviewQuery();

  return (
    <>
      <QuickActionsSection />
      {isLoading ? <OverviewSkeleton /> : <OverviewSection overview={overview} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <GroupsSection />
        <RecentActivitiesSection />
      </div>
    </>
  );
};

export default TreasurerPageClient;
