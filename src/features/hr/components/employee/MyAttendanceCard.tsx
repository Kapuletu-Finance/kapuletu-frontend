"use client";

import { CalendarCheck } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AttendanceCalendar } from "@/features/hr/components/shared/AttendanceCalendar";
import { AttendanceSummaryStats } from "@/features/hr/components/shared/AttendanceSummaryStats";
import { PeriodNavigator } from "@/features/hr/components/shared/PeriodNavigator";
import { useMyAttendanceQuery } from "@/features/hr/services/queries";
import { monthRange } from "@/features/hr/utils";

export const MyAttendanceCard: React.FC = () => {
  const [month, setMonth] = useState(() => new Date());
  const range = useMemo(() => monthRange(month), [month]);
  const { data, isLoading } = useMyAttendanceQuery(range);

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" /> My attendance
          </CardTitle>
          <CardDescription>
            Your scheduled office and online days, and how your attendance is tracking.
          </CardDescription>
        </div>
        <PeriodNavigator period="month" date={month} onChange={setMonth} />
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading || !data ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <>
            <AttendanceSummaryStats summary={data.summary} />
            <AttendanceCalendar days={data.days} />
          </>
        )}
      </CardContent>
    </Card>
  );
};
