import Link from "next/link";
import { Button } from "@/components/ui/button";
import CampaignsCard from "@/features/campaigns/components/MyCampaignsCard";

const MyCampaignsCard = () => {
  return (
    <section className="font-semibold flex flex-col gap-4">
      <div className="flex justify-between items-center h-9">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          MY CAMPAIGNS
        </h2>

        <Button size="sm" variant="secondary" className="text-primary hover:bg-primary/10">
          <Link href="#">View Details</Link>
        </Button>
      </div>

      <CampaignsCard />
    </section>
  );
};

export default MyCampaignsCard;
