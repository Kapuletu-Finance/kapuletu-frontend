"use client";

import { parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import CreateGroupButtonDialogForm from "@/features/groups/components/CreateGroupButtonDialogForm";
import GroupCard, { type GroupInfo } from "@/features/groups/components/GroupCard";
import GroupsHeaderControls from "@/features/groups/components/GroupsHeaderControls";
import IconLibrary from "@/features/shared/components/IconLibrary";
import PageLayout from "@/features/shared/components/PageLayout";
import StatCard from "@/features/shared/components/StatCard";
import { cn } from "@/lib/utils";

interface TreasurerGroupsPageClientProps {
  groups: GroupInfo[];
}

export const TreasurerGroupsPageClient = ({ groups }: TreasurerGroupsPageClientProps) => {
  const [view] = useQueryState("view", parseAsString.withDefault("grid"));

  const activeGroups = groups.filter((g) => g.status === "Active").length;
  const archivedGroups = groups.filter((g) => g.status === "Archived").length;

  return (
    <PageLayout
      actionButton={<CreateGroupButtonDialogForm />}
      stats={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            label="Total number of groups"
            count={groups.length}
            trend="+5% vs last month"
            trendDirection="up"
            iconName="group"
          />
          <StatCard
            label="Active groups"
            count={activeGroups}
            trend="+5% vs last month"
            trendDirection="up"
            iconName="check-circle"
          />
          <StatCard
            label="Archived groups"
            count={archivedGroups}
            trend="- 0% vs last month"
            trendDirection="neutral"
            iconName="lock"
          />
        </div>
      }
      controls={<GroupsHeaderControls />}
      pagination={
        <div className="flex justify-center items-center gap-2 pt-6">
          <Button variant="outline" size="icon" className="rounded-full text-muted-foreground">
            <IconLibrary name="chevron-left" className="w-4 h-4" />
          </Button>
          <Button size="icon" className="rounded-full font-semibold shadow-sm">
            1
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full text-foreground font-medium"
          >
            2
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full text-foreground font-medium"
          >
            3
          </Button>
          <Button variant="outline" size="icon" className="rounded-full text-muted-foreground">
            <IconLibrary name="chevron-right" className="w-4 h-4" />
          </Button>
        </div>
      }
    >
      <div
        className={cn(
          view === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            : "flex flex-col gap-4",
        )}
      >
        {groups.map((group) => (
          <GroupCard key={group.id ?? group.name} group={group} variant={view as "grid" | "list"} />
        ))}
      </div>
    </PageLayout>
  );
};
