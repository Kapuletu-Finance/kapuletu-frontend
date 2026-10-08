"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkLocationsCard } from "@/features/hr/components/admin/locations/WorkLocationsCard";
import { EmployeeScheduleEditor } from "@/features/hr/components/admin/schedule/EmployeeScheduleEditor";
import { ScheduleOverridesCard } from "@/features/hr/components/admin/schedule/ScheduleOverridesCard";
import { WeeklyScheduleEditor } from "@/features/hr/components/admin/schedule/WeeklyScheduleEditor";
import { useEmployeeOptions } from "@/features/hr/hooks/useEmployeeOptions";
import { useUpdateCompanyScheduleMutation } from "@/features/hr/services/mutations";
import { useCompanyScheduleQuery } from "@/features/hr/services/queries";
import type { ScheduleDay } from "@/features/hr/types";

const CompanyScheduleCard: React.FC<{ schedule?: ScheduleDay[] }> = ({ schedule }) => {
  const mutation = useUpdateCompanyScheduleMutation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company weekly pattern</CardTitle>
        <CardDescription>
          Which days everyone works in the office, online, or not at all. Physical days require GPS
          check-in within the office radius.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {schedule ? (
          <WeeklyScheduleEditor
            days={schedule}
            onSave={(days) => mutation.mutate(days)}
            isSaving={mutation.isPending}
          />
        ) : (
          <Skeleton className="h-72 w-full" />
        )}
      </CardContent>
    </Card>
  );
};

const EmployeeScheduleCard: React.FC = () => {
  const employeeItems = useEmployeeOptions();
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Per-employee patterns</CardTitle>
        <CardDescription>
          Give someone a different weekly pattern. Days left on “Company” follow the company
          pattern.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select items={employeeItems} value={userId} onValueChange={(v) => setUserId(v)}>
          <SelectTrigger className="w-full sm:w-80">
            <SelectValue placeholder="Choose an employee" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(employeeItems).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {userId && <EmployeeScheduleEditor userId={userId} />}
      </CardContent>
    </Card>
  );
};

export const WorkScheduleTab: React.FC = () => {
  const { data: companySchedule } = useCompanyScheduleQuery();
  return (
    <div className="space-y-6">
      <WorkLocationsCard />
      <div className="grid gap-6 xl:grid-cols-2">
        <CompanyScheduleCard schedule={companySchedule} />
        <EmployeeScheduleCard />
      </div>
      <ScheduleOverridesCard />
    </div>
  );
};
