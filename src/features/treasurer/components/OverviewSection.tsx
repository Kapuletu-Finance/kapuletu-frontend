import ActiveCampaignsCard from "@/features/campaigns/components/ActiveCampaignsCard";
import PendingContributionsCard from "@/features/contributions/components/PendingContributionsCard";
import TotalContributionsCard from "@/features/contributions/components/TotalContributionsCard";
import TotalGroupsCard from "@/features/groups/components/TotalGroupsCard";

const OverviewSection = () => {
  return (
    <section className="space-y-4 mt-8">
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">OVERVIEW</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TotalGroupsCard />
        <ActiveCampaignsCard />
        <TotalContributionsCard />
        <PendingContributionsCard />
      </div>
    </section>
  );
};

export default OverviewSection;
