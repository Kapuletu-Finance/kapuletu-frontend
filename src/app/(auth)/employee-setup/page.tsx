import React, { Suspense } from "react";
import EmployeeSetupClient from "@/features/auth/components/EmployeeSetupClient";

export const metadata = {
  title: "Employee Setup - KapuLetu",
  description: "Setup your KapuLetu employee account.",
};

export default function EmployeeSetupPage() {
  return (
    <Suspense
      fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}
    >
      <EmployeeSetupClient />
    </Suspense>
  );
}
