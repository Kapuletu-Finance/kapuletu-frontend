import React from "react";
import AdminApprovalsClient from "@/features/admin/components/AdminApprovalsClient";

export const metadata = {
  title: "Approvals Queue - Admin Dashboard",
  description: "Maker-Checker approval queue for sensitive actions.",
};

export default function AdminApprovalsPage() {
  return <AdminApprovalsClient />;
}
