import React from "react";
import AdminEmployeesClient from "@/features/admin/components/AdminEmployeesClient";

export const metadata = {
  title: "Employee Management - Admin Dashboard",
  description: "Manage internal employees and access control.",
};

export default function AdminEmployeesPage() {
  return <AdminEmployeesClient />;
}
