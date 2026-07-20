import CreateCampaignButton from "@/features/campaigns/components/CreateCampaignButton";
import AddContributionButton from "@/features/contributions/components/AddContributionButton";
import CreateGroupButtonWithIcon from "@/features/groups/components/CreateGroupButtonWithIcon";
import GetReportButton from "@/features/reports/components/GetReportButton";
import ReviewTransactionButton from "@/features/transactions/components/ReviewTransactionButton";

const QuickActionsSection = () => {
  return (
    <section className="bg-background p-6 rounded-3xl space-y-4 shadow-sm">
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        QUICK ACTIONS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <CreateGroupButtonWithIcon />
        <CreateCampaignButton />
        <AddContributionButton />
        <ReviewTransactionButton />
        <GetReportButton />
      </div>
    </section>
  );
};

export default QuickActionsSection;
