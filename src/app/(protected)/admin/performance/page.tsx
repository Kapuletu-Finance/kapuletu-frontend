import { PerformanceDashboardClient } from "@/features/admin/components/performance/PerformanceDashboardClient";

export const metadata = {
  title: "Platform Performance | Admin",
  description: "Monitor platform activity, system health, and events.",
};

export default function PerformancePage() {
  return <PerformanceDashboardClient />;
}
