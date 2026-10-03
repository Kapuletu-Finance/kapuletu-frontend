import CampaignDangerZoneCard from "@/features/campaigns/components/CampaignDangerZoneCard";
import CampaignDetailsCard from "@/features/campaigns/components/CampaignDetailsCard";
import CampaignTemplateCard from "@/features/campaigns/components/CampaignTemplateCard";

export default function CampaignSettingsPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <CampaignDetailsCard />
      <CampaignTemplateCard />
      <CampaignDangerZoneCard />
    </div>
  );
}
