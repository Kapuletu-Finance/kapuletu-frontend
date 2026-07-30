"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCampaignActivitiesQuery } from "@/features/campaigns/services/queries";
import ActivityList from "@/features/shared/components/ActivityList";
import IconLibrary from "@/features/shared/components/IconLibrary";

const RecentCampaignActivityCard = () => {
  const params = useParams();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";
  const { data: activities, isLoading } = useCampaignActivitiesQuery(campaignSlug);

  const activityItems = (activities ?? []).map((item) => ({
    id: item.log_id,
    icon: <IconLibrary name="add-circle" className="w-5 h-5 fill-refined-blue text-background" />,
    title: item.action,
    time: new Date(item.date).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return (
    <Card className="border-none bg-card overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          RECENT ACTIVITIES
        </h2>
      </CardHeader>

      <CardContent>
        <ActivityList
          activities={activityItems}
          isLoading={isLoading}
          emptyMessage="No activity yet."
        />
      </CardContent>
    </Card>
  );
};

export default RecentCampaignActivityCard;
