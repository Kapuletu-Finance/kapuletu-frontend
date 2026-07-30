import CampaignDetailsCard from "@/features/campaigns/components/CampaignDetailsCard";
import CampaignTemplateCard from "@/features/campaigns/components/CampaignTemplateCard";

export default function CampaignSettingsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <CampaignDetailsCard />
      <CampaignTemplateCard />
    </div>
  );
}
