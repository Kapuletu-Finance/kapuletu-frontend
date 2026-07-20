import MyCampaignsCard from "@/features/dashboard/components/MyCampaignsCard";
import OverviewSection from "@/features/dashboard/components/OverviewSection";
import QuickActionsSection from "@/features/dashboard/components/QuickActionsSection";
import RecentActivitiesCard from "@/features/dashboard/components/RecentActivitiesCard";

const TreasurerPage = () => {
  return (
    <>
      <QuickActionsSection />
      <OverviewSection />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <MyCampaignsCard />
        <RecentActivitiesCard />
      </div>
    </>
  );
};

export default TreasurerPage;
