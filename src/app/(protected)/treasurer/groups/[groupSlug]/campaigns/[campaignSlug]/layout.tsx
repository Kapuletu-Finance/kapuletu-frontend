import type React from "react";
import CampaignDetailsPageClient from "@/features/campaigns/components/CampaignDetailsPageClient";

interface CampaignDetailsLayoutProps {
  children: React.ReactNode;
}

const CampaignDetailsLayout: React.FC<CampaignDetailsLayoutProps> = ({ children }) => {
  return <CampaignDetailsPageClient>{children}</CampaignDetailsPageClient>;
};

export default CampaignDetailsLayout;
