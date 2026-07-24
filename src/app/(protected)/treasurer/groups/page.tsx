import type { GroupInfo } from "@/features/groups/components/GroupCard";
import { TreasurerGroupsPageClient } from "@/features/groups/components/TreasurerGroupsPageClient";

const groupsData: GroupInfo[] = [
  {
    id: "1",
    slug: "st-peters-welfare",
    name: "St. Peters Welfare",
    description: "Community fund for emergencies",
    iconClassName: "bg-[#E67E22] text-white",
    status: "Active",
    isFavorite: true,
    campaigns: [
      { name: "Food Drive", progress: 60 },
      { name: "Medical Fund", progress: 90 },
      { name: "Annual Fund", progress: 30 },
    ],
  },
  {
    id: "2",
    slug: "unity-group",
    name: "Unity Group",
    description: "A joint investments group",
    iconClassName: "bg-[#34495E] text-white",
    status: "Active",
    isFavorite: false,
    campaigns: [
      { name: "Business Venture", progress: 70 },
      { name: "Land Asset Project", progress: 27 },
    ],
  },
  {
    id: "3",
    slug: "church",
    name: "Church",
    description: "Community fellowship & outreach",
    iconClassName: "bg-[#16A085] text-white",
    status: "Active",
    isFavorite: false,
    campaigns: [
      { name: "Instruments Drive", progress: 46 },
      { name: "Sanctuary Expansion", progress: 90 },
      { name: "Sunday School Outreach", progress: 30 },
    ],
  },
  {
    id: "4",
    slug: "unity-group-archived",
    name: "Unity Group",
    description: "A joint investments group",
    iconClassName: "bg-[#34495E] text-white",
    status: "Archived",
    isFavorite: false,
    campaigns: [
      { name: "Business Venture", progress: 70 },
      { name: "Land Asset Project", progress: 27 },
    ],
  },
  {
    id: "5",
    slug: "church-2",
    name: "Church",
    description: "Community fellowship & outreach",
    iconClassName: "bg-[#16A085] text-white",
    status: "Active",
    isFavorite: false,
    campaigns: [
      { name: "Instruments Drive", progress: 46 },
      { name: "Sanctuary Expansion", progress: 90 },
      { name: "Sunday School Outreach", progress: 30 },
    ],
  },
  {
    id: "6",
    slug: "st-peters-welfare-2",
    name: "St. Peters Welfare",
    description: "Community fund for emergencies",
    iconClassName: "bg-[#E67E22] text-white",
    status: "Active",
    isFavorite: true,
    campaigns: [
      { name: "Food Drive", progress: 60 },
      { name: "Medical Fund", progress: 90 },
      { name: "Annual Fund", progress: 30 },
    ],
  },
];

const GroupsPage = () => {
  return <TreasurerGroupsPageClient groups={groupsData} />;
};

export default GroupsPage;
