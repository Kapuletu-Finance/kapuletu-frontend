import React from "react";
import { AdminEmployeeProfileClient } from "@/features/admin/components/AdminEmployeeProfileClient";

export default function EmployeeWorkspacePage({ params }: { params: { userId: string } }) {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 flex-1">
      <AdminEmployeeProfileClient userId={params.userId} />
    </div>
  );
}
