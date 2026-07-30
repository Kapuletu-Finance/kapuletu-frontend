import { Card, CardContent, CardHeader } from "@/components/ui/card";
import EmptyState from "@/features/shared/components/EmptyState";
import { PlusCircle } from "lucide-react";

interface Activity {
  icon: React.ElementType;
  title: string;
  time: string;
}

const activities: Activity[] = [
  { icon: PlusCircle, title: "New contribution of Ksh. 5,000", time: "13 JULY 11:21 PM" },
  { icon: PlusCircle, title: "New contribution of Ksh. 200", time: "11 JULY 9:28 PM" },
  { icon: PlusCircle, title: "New contribution of Ksh. 500", time: "9 JULY 3:52 PM" },
  { icon: PlusCircle, title: "New contribution of Ksh. 900", time: "9 JULY 11:35 AM" },
];

const RecentCampaignActivityCard = () => {
  const hasActivities = activities.length > 0;

  return (
    <Card className="rounded-3xl border-none shadow-sm bg-card overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b border-border">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          RECENT ACTIVITIES
        </h2>
      </CardHeader>

      <CardContent className="p-6">
        {hasActivities ? (
          <div className="space-y-8">
            {activities.map((activity, index) => (
              <div key={index} className="flex gap-4 relative">
                {/* Connector Line */}
                {index !== activities.length - 1 && (
                  <div className="absolute left-[18px] top-8 bottom-[-32px] w-[2px] bg-border" />
                )}
                
                <div className="bg-refined-blue/10 p-2 rounded-full h-9 w-9 flex items-center justify-center shrink-0 z-10 text-refined-blue">
                  <activity.icon className="w-5 h-5" />
                </div>
                
                <div>
                  <p className="font-semibold text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground font-medium">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No activity yet." />
        )}
      </CardContent>
    </Card>
  );
};

export default RecentCampaignActivityCard;