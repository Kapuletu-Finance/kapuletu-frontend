import { PlanEditor } from "@/features/admin/components/finance/PlanEditor";

export default async function AdminEditPlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  return <PlanEditor planId={planId} />;
}
