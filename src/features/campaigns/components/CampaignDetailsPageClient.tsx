"use client";

import { useParams } from "next/navigation";
import type React from "react";

import { TreasurerCampaignDetailPageClient } from "@/features/campaigns/components/TreasurerCampaignDetailPageClient";
import { useCampaignsQuery } from "@/features/campaigns/services/queries";
import { useGroupsQuery } from "@/features/groups/services/queries";
import { getAvatarColor } from "@/lib/colors";

interface CampaignDetailsPageClientProps {
  children?: React.ReactNode;
}

const CampaignDetailsPageClient: React.FC<CampaignDetailsPageClientProps> = ({ children }) => {
  const params = useParams();
  const groupSlug = typeof params.groupSlug === "string" ? params.groupSlug : "";
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";

  // Resolve group UUID from slug
  const {
    data: groupsData,
    isLoading: isGroupsLoading,
    isFetching: isGroupsFetching,
  } = useGroupsQuery({ limit: 100 });
  const currentGroup = groupsData?.items?.find((g) => g.slug === groupSlug);
  const groupId = currentGroup?.id || "";

  const {
    data,
    isLoading: isCampaignsLoading,
    isFetching: isCampaignsFetching,
  } = useCampaignsQuery(groupId, { limit: 100 });

  const campaignData = data?.items?.find((c) => c.slug === campaignSlug);

  // We are loading if there's no campaignData YET and we are currently fetching either groups or campaigns
  const isLoading =
    !campaignData &&
    (isGroupsLoading || isCampaignsLoading || isGroupsFetching || isCampaignsFetching);

  if (!isLoading && !campaignData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        Campaign not found.
      </div>
    );
  }

  const campaign = campaignData
    ? {
        id: campaignData.id,
        group_id: campaignData.group_id,
        slug: campaignData.slug || undefined,
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
      }
    : {
        id: "loading",
        group_id: "loading",
        name: "",
        description: "",
        iconClassName: "bg-muted",
        status: "Active",
        isFavorite: false,
        progress: 0,
        target_amount: 0,
        total_raised: 0,
        contributor_count: 0,
        end_date: "",
      };

  return (
    <TreasurerCampaignDetailPageClient campaign={campaign} isLoading={isLoading}>
      {children}
    </TreasurerCampaignDetailPageClient>
  );
};

export default CampaignDetailsPageClient;
