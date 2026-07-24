import type { CampaignInfo } from "@/features/campaigns/components/CampaignCard";
import { TreasurerGroupDetailPageClient } from "@/features/groups/components/TreasurerGroupDetailPageClient";

const mockCampaigns: CampaignInfo[] = [
  {
    id: "1",
    slug: "medical-fund-1",
    name: "Medical Fund",
    description: "Contribution towards John Doe's...",
    iconClassName: "bg-[#E67E22] text-white",
    status: "Active",
    isFavorite: false,
    progress: 60,
  },
  {
    id: "2",
    slug: "vbs-1",
    name: "VBS",
    description: "Contribution towards John Doe's...",
    iconClassName: "bg-[#283593] text-white",
    status: "Active",
    isFavorite: false,
    progress: 30,
  },
  {
    id: "3",
    slug: "medical-fund-2",
    name: "Medical Fund",
    description: "Contribution towards John Doe's...",
    iconClassName: "bg-[#16A085] text-white",
    status: "Active",
    isFavorite: false,
    progress: 90,
  },
  {
    id: "4",
    slug: "vbs-2",
    name: "VBS",
    description: "Contribution towards John Doe's...",
    iconClassName: "bg-[#E67E22] text-white",
    status: "Active",
    isFavorite: false,
    progress: 60,
  },
  {
    id: "5",
    slug: "medical-fund-3",
    name: "Medical Fund",
    description: "Contribution towards John Doe's...",
    iconClassName: "bg-[#283593] text-white",
    status: "Archived",
    isFavorite: false,
    progress: 70,
  },
  {
    id: "6",
    slug: "vbs-3",
    name: "VBS",
    description: "Contribution towards John Doe's...",
    iconClassName: "bg-[#16A085] text-white",
    status: "Active",
    isFavorite: false,
    progress: 60,
  },
];

const GroupDetailPage = () => {
  return <TreasurerGroupDetailPageClient campaigns={mockCampaigns} />;
};

export default GroupDetailPage;
