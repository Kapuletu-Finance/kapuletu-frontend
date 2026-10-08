import { EmployeeProfilePage } from "@/features/admin/components/employee-profile/EmployeeProfilePage";

export default async function EmployeeProfileRoute({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-6">
      <EmployeeProfilePage userId={userId} />
    </div>
  );
}
