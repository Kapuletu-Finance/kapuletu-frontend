import MyCampaignsSection from "@/features/treasurer/components/MyCampaignsSection";
import OverviewSection from "@/features/treasurer/components/OverviewSection";
import QuickActionsSection from "@/features/treasurer/components/QuickActionsSection";
import RecentActivitiesSection from "@/features/treasurer/components/RecentActivitiesSection";

const TreasurerPage = () => {
  return (
    <>
      <QuickActionsSection />
      <OverviewSection />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <MyCampaignsSection />
        <RecentActivitiesSection />
      </div>
    </>
  );
};

export default TreasurerPage;
