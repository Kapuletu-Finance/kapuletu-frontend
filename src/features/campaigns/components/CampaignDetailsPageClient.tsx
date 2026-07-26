"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { TreasurerCampaignDetailPageClient } from "@/features/campaigns/components/TreasurerCampaignDetailPageClient";
import { useCampaignsQuery } from "@/features/campaigns/services/queries";
import { getAvatarColor } from "@/lib/colors";

const CampaignDetailSkeleton = () => (
  <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-12">
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-6">
        <Skeleton className="w-24 h-24 rounded-full shrink-0" />
        <div className="flex flex-col justify-center gap-2">
          <Skeleton className="h-9 w-56 rounded-md" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
        </div>
      </div>
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-3/4 rounded-md" />
    </div>

    <div className="border-b mb-6">
      <div className="flex gap-8">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-28 rounded-md" />
        <Skeleton className="h-10 w-20 rounded-md" />
        <Skeleton className="h-10 w-20 rounded-md" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Skeleton className="min-h-100 rounded-xl" />
      <Skeleton className="min-h-100 rounded-xl" />
    </div>
  </div>
);

const CampaignDetailsPageClient = () => {
  const params = useParams();
  const groupId = typeof params.groupId === "string" ? params.groupId : "";
  const campaignId = typeof params.campaignId === "string" ? params.campaignId : "";

  const { data, isLoading } = useCampaignsQuery(groupId, { limit: 100 });

  if (isLoading) {
    return <CampaignDetailSkeleton />;
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

export default CampaignDetailsPageClient;
