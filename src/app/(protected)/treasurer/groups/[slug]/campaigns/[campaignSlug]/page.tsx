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

interface CampaignDetailsPageProps {
  params: Promise<{ slug: string; campaignSlug: string }>;
}

const CampaignDetailsPage: React.FC<CampaignDetailsPageProps> = async ({ params }) => {
  const resolvedParams = await params;
  // Find campaign or use a default one for the mock
  const campaign =
    mockCampaigns.find((c) => c.slug === resolvedParams.campaignSlug) || mockCampaigns[1];

  return <TreasurerCampaignDetailPageClient campaign={campaign} />;
};

export default CampaignDetailsPage;
