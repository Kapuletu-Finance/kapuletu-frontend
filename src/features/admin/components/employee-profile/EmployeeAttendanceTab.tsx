"use client";

import { FileDown } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeWorkReports } from "@/features/admin/components/employee-profile/EmployeeWorkReports";
import type { EmployeeProfile } from "@/features/admin/services/employeeProfile";
import { AdjustDayDialog } from "@/features/hr/components/admin/attendance/AdjustDayDialog";
import { EmployeeScheduleEditor } from "@/features/hr/components/admin/schedule/EmployeeScheduleEditor";
import { AttendanceCalendar } from "@/features/hr/components/shared/AttendanceCalendar";
import { AttendanceSummaryStats } from "@/features/hr/components/shared/AttendanceSummaryStats";
import { PeriodNavigator } from "@/features/hr/components/shared/PeriodNavigator";
import { useDownloadAttendanceReportMutation } from "@/features/hr/services/mutations";
import { useAttendanceReportQuery } from "@/features/hr/services/queries";
import type { AttendanceDay, AttendanceReportParams } from "@/features/hr/types";
import { toDateParam } from "@/features/hr/utils";

export const EmployeeAttendanceTab: React.FC<{ employee: EmployeeProfile }> = ({ employee }) => {
  const [month, setMonth] = useState(() => new Date());
  const [correcting, setCorrecting] = useState<AttendanceDay | null>(null);
  const params = useMemo<AttendanceReportParams>(
    () => ({ anchor: toDateParam(month), period: "month", user_id: employee.user_id }),
    [month, employee.user_id],
  );
  const { data: report, isLoading } = useAttendanceReportQuery(params);
  const download = useDownloadAttendanceReportMutation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle>Attendance register</CardTitle>
            <CardDescription>
              Click any past day to correct it (excused leave, failed GPS, forgotten clock-in).
              Corrections are logged and the employee is notified.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PeriodNavigator period="month" date={month} onChange={setMonth} />
            <Button
              variant="outline"
              className="gap-2"
              disabled={download.isPending}
              onClick={() => download.mutate(params)}
            >
              <FileDown className="h-4 w-4" />
              {download.isPending ? "Preparing..." : "Statement PDF"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {isLoading || !report?.days ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <>
              <AttendanceSummaryStats summary={report.totals} detailed />
              <AttendanceCalendar days={report.days} onDayClick={setCorrecting} />
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly schedule</CardTitle>
            <CardDescription>
              Days left on “Company” follow the company pattern. Use date overrides for one-off
              changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeeScheduleEditor userId={employee.user_id} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily work reports</CardTitle>
            <CardDescription>
              {employee.reports_pending} awaiting review · {employee.reports_confirmed} confirmed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeeWorkReports userId={employee.user_id} />
          </CardContent>
        </Card>
      </div>

      {correcting && (
        <AdjustDayDialog
          key={correcting.date}
          employee={employee}
          day={correcting}
          onClose={() => setCorrecting(null)}
        />
      )}
    </div>
  );
};
