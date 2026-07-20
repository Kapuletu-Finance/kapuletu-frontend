import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Campaign {
  name: string;
  progress: number;
}

const campaigns: Campaign[] = [
  { name: "Community outreach", progress: 60 },
  { name: "Instruments Drive", progress: 30 },
  { name: "VBS", progress: 80 },
  { name: "Construction", progress: 60 },
];

const MyCampaignsCard = () => {
  return (
    <Card className="shadow-sm p-6 flex-1 flex flex-col justify-between rounded-2xl">
      <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3.5 border-b border-border/50">
        <span>Campaign</span>
        <span>Progress</span>
      </div>

      <div className="flex flex-col flex-1 justify-around">
        {campaigns.map((campaign) => (
          <div
            key={campaign.name}
            className="flex items-center justify-between gap-4 py-4 border-b border-border/40 last:border-b last:border-border/40"
          >
            <span className="text-foreground text-sm sm:text-base truncate">{campaign.name}</span>
            <div className="flex flex-col items-end gap-1.5 shrink-0 w-28 sm:w-36">
              <span className="text-xs sm:text-sm font-bold text-primary tabular-nums">
                {campaign.progress}%
              </span>
              <Progress
                value={campaign.progress}
                className="w-full **:data-[slot=progress-track]:h-1.5 sm:**:data-[slot=progress-track]:h-2 **:data-[slot=progress-track]:bg-muted/80"
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MyCampaignsCard;
