import { Card } from "@/components/ui/card";

interface Group {
  id: string;
  name: string;
  description: string;
  campaignsCount: number;
  initials: string;
  colorClass: string;
}

const groups: Group[] = [
  {
    id: "1",
    name: "St. Peter's Welfare",
    description: "Community fund for emergencies",
    campaignsCount: 5,
    initials: "SP",
    colorClass: "bg-[#E67E22]",
  },
  {
    id: "2",
    name: "Unity Group",
    description: "A joint investments group",
    campaignsCount: 3,
    initials: "UG",
    colorClass: "bg-[#34495E]",
  },
  {
    id: "3",
    name: "Church",
    description: "Community fellowship & outreach",
    campaignsCount: 8,
    initials: "C",
    colorClass: "bg-[#16A085]",
  },
  {
    id: "4",
    name: "Nyayo Estate",
    description: "Neighborhood social events & initiatives",
    campaignsCount: 2,
    initials: "NE",
    colorClass: "bg-[#E67E22]",
  },
  {
    id: "5",
    name: "Chama",
    description: "Fund for emergencies",
    campaignsCount: 5,
    initials: "C",
    colorClass: "bg-[#34495E]",
  },
];

const GroupsListCard = () => {
  return (
    <Card className="shadow-sm p-6 flex-1 flex flex-col rounded-2xl">
      <div className="flex flex-col">
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex items-center justify-between gap-4 py-4 border-b border-border"
          >
            <div className="flex items-center gap-4">
              <div
                className={`size-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${group.colorClass}`}
              >
                {group.initials}
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-semibold text-sm sm:text-base">
                  {group.name}
                </span>
                <span className="text-xs text-muted-foreground">{group.description}</span>
              </div>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              <span className="font-semibold text-foreground">{group.campaignsCount}</span>{" "}
              campaigns
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GroupsListCard;
