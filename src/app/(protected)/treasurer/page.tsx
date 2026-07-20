import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ActiveCampaignsCard from "@/features/campaigns/components/ActiveCampaignsCard";
import CreateCampaignButton from "@/features/campaigns/components/CreateCampaignButton";
import MyCampaignsCard from "@/features/campaigns/components/MyCampaignsCard";
import AddContributionButton from "@/features/contributions/components/AddContributionButton";
import PendingContributionsCard from "@/features/contributions/components/PendingContributionsCard";
import TotalContributionsCard from "@/features/contributions/components/TotalContributionsCard";
import CreateGroupButton from "@/features/groups/components/CreateGroupButton";
import TotalGroupsCard from "@/features/groups/components/TotalGroupsCard";
import GetReportButton from "@/features/reports/components/GetReportButton";
import EmptyState from "@/features/shared/components/EmptyState";
import ReviewTransactionButton from "@/features/transactions/components/ReviewTransactionButton";

const TreasurerPage = () => {
  return (
    <>
      <section className="bg-background p-6 rounded-3xl space-y-4 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          QUICK ACTIONS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <CreateGroupButton />
          <CreateCampaignButton />
          <AddContributionButton />
          <ReviewTransactionButton />
          <GetReportButton />
        </div>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          OVERVIEW
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TotalGroupsCard />
          <ActiveCampaignsCard />
          <TotalContributionsCard />
          <PendingContributionsCard />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <section className="font-semibold flex flex-col gap-4">
          <div className="flex justify-between items-center h-9">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              MY CAMPAIGNS
            </h2>

            <Button size="sm" variant="secondary" className="text-primary hover:bg-primary/10">
              <Link href="#">View Details</Link>
            </Button>
          </div>

          <MyCampaignsCard />

          {/* <Card className="shadow-sm p-5 flex-1 flex flex-col">
            <div className="flex-1 flex flex-col justify-center rounded-3xl border-none">
              <EmptyState
                message="Create your first campaign!"
                Cta={
                  <Button>
                    <Link href="#">CREATE CAMPAIGN</Link>
                  </Button>
                }
              />
            </div>
          </Card> */}
        </section>

        <section className="font-semibold flex flex-col gap-4">
          <div className="flex items-center h-9">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              RECENT ACTIVITIES
            </h2>
          </div>

          {/* <Card className="shadow-sm p-5 flex-1 flex flex-col">
            <div className="flex-1 flex flex-col justify-center rounded-3xl border-none">
              <EmptyState message="No activity yet." />
            </div>
          </Card> */}
        </section>
      </div>
    </>
  );
};

export default TreasurerPage;
