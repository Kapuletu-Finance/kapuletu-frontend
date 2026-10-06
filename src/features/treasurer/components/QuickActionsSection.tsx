import AddContributionButton from "@/features/contributions/components/AddContributionButton";
import CreateGroupButtonWithIcon from "@/features/groups/components/CreateGroupButtonWithIcon";
import ReviewInboxButton from "@/features/inbox/components/ReviewInboxButton";

const QuickActionsSection = () => {
  return (
    <section className="bg-background p-6 rounded-md space-y-4 shadow-sm">
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        QUICK ACTIONS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CreateGroupButtonWithIcon />
        <AddContributionButton />
        <ReviewInboxButton />
      </div>
    </section>
  );
};

export default QuickActionsSection;
