import type { CampaignInfo } from "@/features/campaigns/components/CampaignCard";
import { TreasurerCampaignDetailPageClient } from "@/features/campaigns/components/TreasurerCampaignDetailPageClient";

// Mock data (we can find the one matching the slug)
const mockCampaigns: CampaignInfo[] = [
  {
    id: "1",
    slug: "medical-fund-1",
    name: "Medical Fund",
    description: "Raising funds to support John Doe's medical treatment.",
    iconClassName: "bg-[#1E3A8A] text-white",
    status: "Active",
    isFavorite: false,
    progress: 60,
  },
  {
    id: "2",
    slug: "medical-fund-2",
    name: "Medical Fund",
    description: "Raising funds to support John Doe's medical treatment.",
    iconClassName: "bg-[#1E3A8A] text-white",
    status: "Active",
    isFavorite: false,
    progress: 60,
  },
];

export default function CampaignDetailsPage({
  params,
}: {
  params: { slug: string; campaignSlug: string };
}) {
  // Find campaign or use a default one for the mock
  const campaign = mockCampaigns.find((c) => c.slug === params.campaignSlug) || mockCampaigns[1];

  return <TreasurerCampaignDetailPageClient campaign={campaign} />;
}
