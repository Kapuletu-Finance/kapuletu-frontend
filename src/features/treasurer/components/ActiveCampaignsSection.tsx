import Link from "next/link";
import { Button } from "@/components/ui/button";
import ActiveCampaignsListCard from "./ActiveCampaignsListCard";

const ActiveCampaignsSection = () => {
  return (
    <section className="font-semibold flex flex-col flex-1 gap-4">
      <div className="flex justify-between items-center h-9">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          ACTIVE CAMPAIGNS
        </h2>

        <Button size="sm" variant="secondary" className="text-primary hover:bg-primary/10">
          <Link href="/treasurer/groups">View All Groups</Link>
        </Button>
      </div>

      <ActiveCampaignsListCard />
    </section>
  );
};

export default ActiveCampaignsSection;
