import type * as React from "react";
import GroupCard, { type GroupInfo } from "@/features/groups/components/GroupCard";

const groupsData: GroupInfo[] = [
  {
    id: "1",
    name: "St. Peters Welfare",
    description: "Community fund for emergencies",
    icon: "🤲",
    iconClassName: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
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
    name: "Unity Group",
    description: "A joint investments group",
    icon: "🌱",
    iconClassName: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
    status: "Active",
    isFavorite: false,
    campaigns: [
      { name: "Business Venture", progress: 70 },
      { name: "Land Asset Project", progress: 27 },
    ],
  },
  {
    id: "3",
    name: "Church",
    description: "Community fellowship & outreach",
    icon: "⛪",
    iconClassName: "bg-amber-400/20 text-amber-800 dark:text-amber-300",
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
    name: "Nyayo Estate",
    description: "Neighborhood social events & initiatives.",
    icon: "🏠",
    iconClassName: "bg-teal-500/15 text-teal-700 dark:text-teal-400",
    status: "Archived",
    isFavorite: false,
    campaigns: [
      { name: "Security Lighting", progress: 100 },
      { name: "End of Year Party", progress: 100 },
    ],
  },
];

const GroupsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Groups</h1>
        <p className="text-muted-foreground text-sm mt-1">
          You are currently managing{" "}
          <span className="font-semibold text-foreground">{groupsData.length}</span> groups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {groupsData.map((group) => (
          <GroupCard key={group.id ?? group.name} group={group} />
        ))}
      </div>
    </div>
  );
};

export default GroupsPage;
