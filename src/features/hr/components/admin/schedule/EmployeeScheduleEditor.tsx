"use client";

import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { WeeklyScheduleEditor } from "@/features/hr/components/admin/schedule/WeeklyScheduleEditor";
import { useUpdateEmployeeScheduleMutation } from "@/features/hr/services/mutations";
import { useCompanyScheduleQuery, useEmployeeScheduleQuery } from "@/features/hr/services/queries";

/** One employee's weekly pattern; weekdays left on "Company" follow the company pattern. */
export const EmployeeScheduleEditor: React.FC<{ userId: string }> = ({ userId }) => {
  const { data: companySchedule } = useCompanyScheduleQuery();
  const { data: employeeSchedule, isLoading } = useEmployeeScheduleQuery(userId);
  const mutation = useUpdateEmployeeScheduleMutation();

  if (isLoading || !employeeSchedule || !companySchedule)
    return <Skeleton className="h-72 w-full" />;
  return (
    <WeeklyScheduleEditor
      key={userId}
      days={employeeSchedule.days}
      inheritFrom={companySchedule}
      onSave={(days) => mutation.mutate({ days, userId })}
      isSaving={mutation.isPending}
    />
  );
};
