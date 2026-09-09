"use client";

import { useParams } from "next/navigation";
import type React from "react";
import { TreasurerCampaignDetailPageClient } from "@/features/campaigns/components/TreasurerCampaignDetailPageClient";
import { useCampaignQuery } from "@/features/campaigns/services/queries";
import { getAvatarColor } from "@/lib/colors";

interface CampaignDetailsPageClientProps {
  children?: React.ReactNode;
}

const CampaignDetailsPageClient: React.FC<CampaignDetailsPageClientProps> = ({ children }) => {
  const params = useParams();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";

  const { data: campaignData, isLoading } = useCampaignQuery(campaignSlug);

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
        payment_instructions: campaignData.payment_instructions,
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
        payment_instructions: null,
      };

  if (!isLoading && !campaignData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        Campaign not found.
      </div>
    );
  }

  return (
    <TreasurerCampaignDetailPageClient campaign={campaign} isLoading={isLoading}>
      {children}
    </TreasurerCampaignDetailPageClient>
  );
};

export default CampaignDetailsPageClient;
