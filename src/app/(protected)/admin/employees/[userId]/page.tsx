import React from "react";
import { AdminEmployeeProfileClient } from "@/features/admin/components/AdminEmployeeProfileClient";

export default async function EmployeeWorkspacePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 flex-1">
      <AdminEmployeeProfileClient userId={resolvedParams.userId} />
    </div>
  );
}
