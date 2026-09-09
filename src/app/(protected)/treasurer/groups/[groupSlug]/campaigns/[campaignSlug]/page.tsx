import CampaignProgressCard from "@/features/campaigns/components/CampaignProgressCard";
import CampaignSummaryCard from "@/features/campaigns/components/CampaignSummaryCard";
import RecentActivitiesCard from "@/features/campaigns/components/RecentCampaignActivityCard";
import RecentContributionsCard from "@/features/campaigns/components/RecentContributionsCard";
import ShareCampaignCard from "@/features/campaigns/components/ShareCampaignCard";

export default function CampaignOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
        <div className="xl:col-span-2">
          <CampaignProgressCard />
        </div>
        <div className="xl:col-span-1">
          <CampaignSummaryCard />
        </div>
      </div>

      <ShareCampaignCard />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentContributionsCard />
        </div>
        <div className="xl:col-span-1">
          <RecentActivitiesCard />
        </div>
      </div>
    </div>
  );
}
