"use client";

import { format } from "date-fns";
import Link from "next/link";
import type React from "react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AdjustDayDialog } from "@/features/hr/components/admin/attendance/AdjustDayDialog";
import { AttendanceDayCell } from "@/features/hr/components/shared/AttendanceDayCell";
import { ATTENDANCE_STATUS_META, toneClasses } from "@/features/hr/components/shared/HrBadges";
import { PeriodNavigator } from "@/features/hr/components/shared/PeriodNavigator";
import { useAttendanceRegisterQuery } from "@/features/hr/services/queries";
import type { AttendanceDay, AttendanceDayStatus, EmployeeBrief } from "@/features/hr/types";
import { monthRange, parseDateParam, toDateParam } from "@/features/hr/utils";
import { cn } from "@/lib/utils";

const LEGEND: AttendanceDayStatus[] = ["present", "late", "absent", "excused", "off", "upcoming"];

export const AttendanceRegisterTab: React.FC = () => {
  const [month, setMonth] = useState(() => new Date());
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<{ employee: EmployeeBrief; day: AttendanceDay } | null>(
    null,
  );
  const today = toDateParam(new Date());
  const range = useMemo(() => monthRange(month), [month]);
  const { data, isLoading } = useAttendanceRegisterQuery(range);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data?.rows ?? []).filter(
      (row) =>
        !q ||
        `${row.employee.first_name} ${row.employee.last_name} ${row.employee.role}`
          .toLowerCase()
          .includes(q),
    );
  }, [data, search]);

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle>Attendance register</CardTitle>
          <CardDescription>
            Daily attendance against each employee&apos;s schedule. Hover a cell for details; click
            a day to correct it (e.g. excused leave or a failed GPS check-in).
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees"
            className="h-9 w-44"
          />
          <PeriodNavigator period="month" date={month} onChange={setMonth} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {LEGEND.map((status) => (
            <span key={status} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded border text-[10px] font-bold",
                  toneClasses(ATTENDANCE_STATUS_META[status].tone),
                )}
              >
                {status === "upcoming" ? "P/O" : ATTENDANCE_STATUS_META[status].short}
              </span>
              {ATTENDANCE_STATUS_META[status].label}
              {status === "upcoming" && " (expected mode)"}
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-foreground" /> Adjusted by HR
          </span>
        </div>

        {isLoading || !data ? (
          <Skeleton className="h-64 w-full" />
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No employees found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="sticky left-0 z-10 min-w-48 bg-muted/95 px-3 py-2 text-left font-medium">
                    Employee
                  </th>
                  {data.dates.map((date) => {
                    const d = parseDateParam(date);
                    return (
                      <th
                        key={date}
                        className="px-0.5 py-2 text-center font-normal text-muted-foreground"
                      >
                        <div className="text-[10px] uppercase">{format(d, "EEEEE")}</div>
                        <div className="text-xs font-semibold text-foreground">
                          {format(d, "d")}
                        </div>
                      </th>
                    );
                  })}
                  <th className="px-3 py-2 text-right font-medium">Rate</th>
                  <th className="px-3 py-2 text-right font-medium">Late</th>
                  <th className="px-3 py-2 text-right font-medium">Absent</th>
                  <th className="px-3 py-2 text-right font-medium">Meetings</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ employee, days, summary }) => (
                  <tr key={employee.user_id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="sticky left-0 z-10 bg-background px-3 py-2">
                      <Link
                        href={`/admin/employees/${employee.user_id}`}
                        className="font-medium hover:underline"
                      >
                        {employee.first_name} {employee.last_name}
                      </Link>
                    </td>
                    {days.map((day) => (
                      <td key={day.date} className="px-0.5 py-1.5 text-center">
                        {day.date <= today ? (
                          <button
                            type="button"
                            aria-label={`Correct ${employee.first_name}'s attendance on ${day.date}`}
                            className="mx-auto block rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                            onClick={() => setEditing({ day, employee })}
                          >
                            <AttendanceDayCell
                              day={day}
                              className="h-6 w-6 cursor-pointer text-[10px] font-bold hover:ring-2 hover:ring-primary/40"
                            />
                          </button>
                        ) : (
                          <AttendanceDayCell
                            day={day}
                            className="mx-auto h-6 w-6 text-[10px] font-normal"
                          />
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-right font-semibold tabular-nums">
                      {summary.attendance_rate === null ? "—" : `${summary.attendance_rate}%`}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{summary.late}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{summary.absent}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {summary.meetings.attended}/{summary.meetings.invited}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
      {editing && (
        <AdjustDayDialog
          key={`${editing.employee.user_id}-${editing.day.date}`}
          employee={editing.employee}
          day={editing.day}
          onClose={() => setEditing(null)}
        />
      )}
    </Card>
  );
};
