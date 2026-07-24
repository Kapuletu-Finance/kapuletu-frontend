import GroupsSection from "@/features/treasurer/components/GroupsSection";
import OverviewSection from "@/features/treasurer/components/OverviewSection";
import QuickActionsSection from "@/features/treasurer/components/QuickActionsSection";
import RecentActivitiesSection from "@/features/treasurer/components/RecentActivitiesSection";

const TreasurerPage = () => {
  return (
    <>
      <QuickActionsSection />
      <OverviewSection />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <GroupsSection />
        <RecentActivitiesSection />
      </div>
    </>
  );
};

export default TreasurerPage;
