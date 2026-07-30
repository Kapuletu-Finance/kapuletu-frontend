import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/features/shared/components/EmptyState";
import IconLibrary from "@/features/shared/components/IconLibrary";

export interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  title: React.ReactNode;
  time: React.ReactNode;
}

export interface ActivityListProps {
  activities: ActivityItem[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  isLoading,
  emptyMessage = "No activity yet.",
}) => {
  if (isLoading) {
    return (
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
    );
  }

  if (activities.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex gap-3.5 relative items-start">
          {index !== activities.length - 1 && (
            <div className="absolute left-[9.5px] top-6.5 bottom-0.5 w-0.5 bg-border/80" />
          )}

          <div className="w-5 h-5 flex items-center justify-center shrink-0 z-10 mt-0.5">
            {activity.icon}
          </div>

          <div className="flex flex-col gap-1">
            <div className="font-medium text-foreground text-sm sm:text-base leading-snug">
              {activity.title}
            </div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {activity.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
