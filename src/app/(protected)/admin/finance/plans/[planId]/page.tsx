import React from "react";
import { PlanEditor } from "@/features/admin/components/finance/PlanEditor";

export default async function AdminEditPlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PlanEditor planId={planId} />
    </div>
  );
}
