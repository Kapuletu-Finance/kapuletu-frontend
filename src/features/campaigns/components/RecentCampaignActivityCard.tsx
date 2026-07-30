import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ActivityList, { type ActivityItem } from "@/features/shared/components/ActivityList";
import IconLibrary from "@/features/shared/components/IconLibrary";

const activities: ActivityItem[] = [
  {
    id: "1",
    icon: <IconLibrary name="add-circle" className="w-5 h-5 fill-refined-blue text-background" />,
    title: "New contribution of Ksh. 5,000",
    time: "13 JULY 11:21 PM",
  },
  {
    id: "2",
    icon: <IconLibrary name="add-circle" className="w-5 h-5 fill-refined-blue text-background" />,
    title: "New contribution of Ksh. 200",
    time: "11 JULY 9:28 PM",
  },
  {
    id: "3",
    icon: <IconLibrary name="add-circle" className="w-5 h-5 fill-refined-blue text-background" />,
    title: "New contribution of Ksh. 500",
    time: "9 JULY 3:52 PM",
  },
  {
    id: "4",
    icon: <IconLibrary name="add-circle" className="w-5 h-5 fill-refined-blue text-background" />,
    title: "New contribution of Ksh. 900",
    time: "9 JULY 11:35 AM",
  },
];

const RecentCampaignActivityCard = () => {
  return (
    <Card className="border-none bg-card overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          RECENT ACTIVITIES
        </h2>
      </CardHeader>

      <CardContent>
        <ActivityList activities={activities} emptyMessage="No activity yet." />
      </CardContent>
    </Card>
  );
};

export default RecentCampaignActivityCard;
