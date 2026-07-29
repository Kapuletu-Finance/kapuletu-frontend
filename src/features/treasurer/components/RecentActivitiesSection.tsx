"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/features/shared/components/EmptyState";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { useWorkspaceOverviewQuery } from "@/features/treasurer/services/queries";

const getActionIcon = (action: string) => {
  if (action.toLowerCase().includes("campaign")) {
    return <IconLibrary name="add-circle" className="w-5 h-5 fill-primary text-background" />;
  }
  if (action.toLowerCase().includes("approved") || action.toLowerCase().includes("transaction")) {
    return <IconLibrary name="contribution" className="w-5 h-5 text-amber-500" />;
  }
  if (action.toLowerCase().includes("group")) {
    return <IconLibrary name="group" className="w-5 h-5 text-primary dark:text-primary" />;
  }
  return <IconLibrary name="add-circle" className="w-5 h-5 fill-primary text-background" />;
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

  return (
    <section className="flex flex-col flex-1 gap-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-9 flex items-center">
        RECENT ACTIVITIES
      </h2>

      <Card className="shadow-sm p-6 border-none flex-1 flex flex-col justify-between">
        {isLoading ? (
          <div className="flex flex-col gap-4 py-2">
            {["sk-1", "sk-2", "sk-3", "sk-4"].map((key) => (
              <div key={key} className="flex gap-3.5 items-start flex-1">
                <div className="w-5 h-5 flex items-center justify-center shrink-0 z-10 mt-0.5">
                  <IconLibrary name="add-circle" className="w-5 h-5 text-muted-foreground/40" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <Skeleton className="h-4 w-full max-w-48 rounded-md" />
                  <Skeleton className="h-3 w-24 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <ScrollArea className="h-87.5 pr-4">
            <div className="flex flex-col gap-4 py-2">
              {activities.map((activity, index) => (
                <div key={activity.log_id} className="flex gap-3.5 relative items-start">
                  {index !== activities.length - 1 && (
                    <div className="absolute left-[9.5px] top-6.5 bottom-0.5 w-0.5 bg-border/80" />
                  )}

                  <div className="w-5 h-5 flex items-center justify-center shrink-0 z-10 mt-0.5">
                    {getActionIcon(activity.action)}
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-foreground text-sm sm:text-base leading-snug">
                      {activity.action}
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {formatTimestamp(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <EmptyState message="No activity yet." />
        )}
      </Card>
    </section>
  );
};

export default RecentActivitiesSection;
