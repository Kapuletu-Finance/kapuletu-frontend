import ActiveCampaignsCard from "@/features/campaigns/components/ActiveCampaignsCard";
import PendingContributionsCard from "@/features/contributions/components/PendingContributionsCard";
import TotalContributionsCard from "@/features/contributions/components/TotalContributionsCard";
import TotalGroupsCard from "@/features/groups/components/TotalGroupsCard";
import type { WorkspaceOverviewOut } from "@/features/shared/types";

interface OverviewSectionProps {
  overview?: WorkspaceOverviewOut;
}

const OverviewSection = ({ overview }: OverviewSectionProps) => {
  return (
    <section className="space-y-4 mt-8">
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">OVERVIEW</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TotalGroupsCard value={overview?.total_groups} />
        <ActiveCampaignsCard value={overview?.total_campaigns} />
        <TotalContributionsCard value={overview?.active_groups?.length} />
        <PendingContributionsCard value={overview?.pending_approvals} />
      </div>
    </section>
  );
};

export default OverviewSection;
