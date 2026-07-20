import { Coins, PlusCircle, Users } from "lucide-react";
import type React from "react";
import { Card } from "@/components/ui/card";
import EmptyState from "@/features/shared/components/EmptyState";

interface Activity {
  icon: React.ReactNode;
  title: string;
  time: string;
}

const activities: Activity[] = [
  {
    icon: <PlusCircle className="w-5 h-5 fill-primary text-background" />,
    time: "13 JULY 11:21 PM",
    title: 'New campaign "VBS" created',
  },
  {
    icon: <Coins className="w-5 h-5 text-amber-500" />,
    time: "11 JULY 9:28 PM",
    title: "Ksh. 3000 for Community outreach approved",
  },
  {
    icon: <PlusCircle className="w-5 h-5 fill-primary text-background" />,
    time: "9 JULY 3:52 PM",
    title: 'New campaign "Community outreach" created',
  },
  {
    icon: <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />,
    time: "9 JULY 11:35 AM",
    title: 'New group "Church" created',
  },
];

const RecentActivitiesSection = () => {
  const hasActivities = activities.length > 0;

  return (
    <section className="flex flex-col flex-1 gap-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground h-9 flex items-center">
        RECENT ACTIVITIES
      </h2>

      <Card className="shadow-sm p-6 rounded-3xl border-none flex-1 flex flex-col justify-between">
        {hasActivities ? (
          <div className="flex flex-col flex-1 justify-between py-2">
            {activities.map((activity, index) => (
              <div key={activity.title} className="flex gap-3.5 relative flex-1 items-start">
                {/* Connector Line */}
                {index !== activities.length - 1 && (
                  <div className="absolute left-[9.5px] top-6.5 bottom-0.5 w-0.5 bg-border/80" />
                )}

                <div className="w-5 h-5 flex items-center justify-center shrink-0 z-10 mt-0.5">
                  {activity.icon}
                </div>

                <div className="flex flex-col gap-1">
                  <p className="font-medium text-foreground text-sm sm:text-base leading-snug">
                    {activity.title}
                  </p>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No activity yet." />
        )}
      </Card>
    </section>
  );
};

export default RecentActivitiesSection;
