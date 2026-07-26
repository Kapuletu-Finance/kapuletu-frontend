"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { TreasurerCampaignDetailPageClient } from "@/features/campaigns/components/TreasurerCampaignDetailPageClient";
import { useCampaignsQuery } from "@/features/campaigns/services/queries";
import { getAvatarColor } from "@/lib/colors";

const CampaignDetailsPage = () => {
  const params = useParams();
  const groupId = typeof params.groupId === "string" ? params.groupId : "";
  const campaignId = typeof params.campaignId === "string" ? params.campaignId : "";

  const { data, isLoading } = useCampaignsQuery(groupId, { limit: 100 });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
        <div className="flex items-center gap-6">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const campaignData = data?.items?.find((c) => c.id === campaignId);

  if (!campaignData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        Campaign not found.
      </div>
    );
  }

  const campaign = {
    id: campaignData.id,
    group_id: campaignData.group_id,
    name: campaignData.title,
    description: campaignData.description || "",
    iconClassName: getAvatarColor(campaignData.title),
    status: campaignData.status === "active" ? "Active" : "Archived",
    isFavorite: campaignData.is_favorite,
    progress: campaignData.progress_percentage ?? 0,
    target_amount: campaignData.target_amount,
    total_raised: campaignData.total_raised,
    contributor_count: campaignData.contributor_count,
    end_date: campaignData.end_date,
  };

  return <TreasurerCampaignDetailPageClient campaign={campaign} />;
};

export default CampaignDetailsPage;
