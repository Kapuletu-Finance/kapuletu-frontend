"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActivityList from "@/features/shared/components/ActivityList";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { useWorkspaceOverviewQuery } from "@/features/treasurer/services/queries";

const getActionIcon = (action: string) => {
  switch (action) {
    case "CAMPAIGN_CREATED":
    case "CAMPAIGN_UPDATED":
    case "CAMPAIGN_ARCHIVED":
      return <IconLibrary name="add-circle" className="w-5 h-5 fill-primary text-background" />;

    case "TXN_APPROVED":
    case "TXN_SPLIT_APPROVED":
    case "MANUAL_ENTRY":
      return <IconLibrary name="contribution" className="w-5 h-5 text-amber-500" />;

    case "GROUP_CREATED":
    case "GROUP_UPDATED":
    case "GROUP_ARCHIVED":
      return (
        <IconLibrary name="group" className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
      );

    default:
      return <IconLibrary name="add-circle" className="w-5 h-5 fill-primary text-background" />;
  }
};

const formatTimestamp = (iso: string) => {
  const date = new Date(iso);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" }).toUpperCase();
  const time = date
    .toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    .toUpperCase();
  return `${day} ${month} ${time}`;
};

const RecentActivitiesSection = () => {
  const { data: overview, isLoading } = useWorkspaceOverviewQuery();
  const activities = overview?.recent_activities ?? [];

  const activityItems = activities.map((activity) => ({
    id: activity.log_id,
    icon: getActionIcon(activity.action),
    title:
      activity.details?.message ||
      activity.action
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" "),
    time: formatTimestamp(activity.created_at),
  }));

  return (
    <section className="flex flex-col flex-1 gap-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-9 flex items-center">
        RECENT ACTIVITIES
      </h2>

      <Card className="border-none flex-1 flex flex-col justify-between">
        {isLoading || activityItems.length === 0 ? (
          <ActivityList
            activities={activityItems}
            isLoading={isLoading}
            emptyMessage="No activity yet."
          />
        ) : (
          <ScrollArea className="h-87.5 pr-4">
            <ActivityList activities={activityItems} isLoading={isLoading} />
          </ScrollArea>
        )}
      </Card>
    </section>
  );
};

export default RecentActivitiesSection;
