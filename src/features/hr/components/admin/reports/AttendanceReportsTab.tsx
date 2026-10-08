"use client";

import { format } from "date-fns";
import { FileDown } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AttendanceTrendChart } from "@/features/hr/components/admin/reports/AttendanceTrendChart";
import { EmployeeAttendanceTable } from "@/features/hr/components/admin/reports/EmployeeAttendanceTable";
import { AttendanceSummaryStats } from "@/features/hr/components/shared/AttendanceSummaryStats";
import { AttendanceStatusBadge, WorkModeBadge } from "@/features/hr/components/shared/HrBadges";
import { PeriodNavigator } from "@/features/hr/components/shared/PeriodNavigator";
import { SegmentedControl } from "@/features/hr/components/shared/SegmentedControl";
import { useEmployeeOptions } from "@/features/hr/hooks/useEmployeeOptions";
import { useDownloadAttendanceReportMutation } from "@/features/hr/services/mutations";
import { useAttendanceReportQuery } from "@/features/hr/services/queries";
import type { AttendanceReport, AttendanceReportParams, SummaryPeriod } from "@/features/hr/types";
import { formatTimeOfDay, parseDateParam, toDateParam } from "@/features/hr/utils";

const ALL = "all";
const PERIOD_OPTIONS: { value: SummaryPeriod; label: string }[] = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Quarter", value: "quarter" },
  { label: "Year", value: "year" },
  { label: "Custom", value: "custom" },
];

const fullName = (e: { first_name: string; last_name: string }) => `${e.first_name} ${e.last_name}`;

const Highlights: React.FC<{ highlights: AttendanceReport["highlights"] }> = ({ highlights }) => {
  const items = [
    {
      label: "Perfect attendance",
      value: highlights.perfect_attendance.map(fullName).join(", "),
    },
    {
      label: "Most absences",
      value: highlights.most_absences.map((c) => `${fullName(c.employee)} (${c.count})`).join(", "),
    },
    {
      label: "Most late arrivals",
      value: highlights.most_late.map((c) => `${fullName(c.employee)} (${c.count})`).join(", "),
    },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border p-3">
          <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
          <p className="mt-1 text-sm">{item.value || "None this period"}</p>
        </div>
      ))}
    </div>
  );
};

const DailyLog: React.FC<{ days: NonNullable<AttendanceReport["days"]> }> = ({ days }) => {
  const recorded = days.filter((d) => d.status !== "upcoming");
  if (recorded.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No days recorded yet in this period.
      </p>
    );
  }
  return (
    <div className="max-h-96 overflow-y-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Expected</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Clock in</TableHead>
            <TableHead>Clock out</TableHead>
            <TableHead>Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recorded.map((day) => (
            <TableRow key={day.date}>
              <TableCell>{format(parseDateParam(day.date), "EEE d MMM yyyy")}</TableCell>
              <TableCell>
                <WorkModeBadge mode={day.mode} />
              </TableCell>
              <TableCell>
                <AttendanceStatusBadge status={day.status} />
              </TableCell>
              <TableCell className="tabular-nums">{formatTimeOfDay(day.clock_in_time)}</TableCell>
              <TableCell className="tabular-nums">{formatTimeOfDay(day.clock_out_time)}</TableCell>
              <TableCell className="text-muted-foreground">
                {day.adjusted ? `Adjusted: ${day.adjustment_reason}` : (day.reason ?? "")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const AttendanceReportsTab: React.FC = () => {
  const [period, setPeriod] = useState<SummaryPeriod>("month");
  const [anchor, setAnchor] = useState(() => new Date());
  const [customStart, setCustomStart] = useState<Date | undefined>();
  const [customEnd, setCustomEnd] = useState<Date | undefined>();
  const [scope, setScope] = useState<string>(ALL);
  const employeeOptions = useEmployeeOptions();
  const scopeItems = useMemo(
    () => ({ [ALL]: "All employees", ...employeeOptions }),
    [employeeOptions],
  );

  const params = useMemo<AttendanceReportParams>(() => {
    const user_id = scope === ALL ? undefined : scope;
    return period === "custom"
      ? {
          end: customEnd && toDateParam(customEnd),
          period,
          start: customStart && toDateParam(customStart),
          user_id,
        }
      : { anchor: toDateParam(anchor), period, user_id };
  }, [period, anchor, customStart, customEnd, scope]);

  const ready = period !== "custom" || (!!customStart && !!customEnd);
  const { data: report, isLoading, isError, error } = useAttendanceReportQuery(params, ready);
  const download = useDownloadAttendanceReportMutation();
  const isStatement = scope !== ALL;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <SegmentedControl options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />
            {period === "custom" ? (
              <div className="flex items-center gap-2">
                <DatePicker date={customStart} setDate={setCustomStart} className="w-40" />
                <span className="text-sm text-muted-foreground">to</span>
                <DatePicker
                  date={customEnd}
                  setDate={setCustomEnd}
                  className="w-40"
                  disabled={customStart ? { before: customStart } : undefined}
                />
              </div>
            ) : (
              <PeriodNavigator period={period} date={anchor} onChange={setAnchor} />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select items={scopeItems} value={scope} onValueChange={(v) => setScope(v ?? ALL)}>
              <SelectTrigger className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(scopeItems).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="gap-2"
              disabled={!ready || !report || download.isPending}
              onClick={() => download.mutate(params)}
            >
              <FileDown className="h-4 w-4" />
              {download.isPending ? "Preparing..." : "Official PDF"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {!ready ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Choose a start and end date for the custom period (up to 366 days).
        </p>
      ) : isError ? (
        <p className="py-10 text-center text-sm text-destructive">{(error as Error).message}</p>
      ) : isLoading || !report ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              {isStatement ? `${fullName(report.rows[0].employee)} · ` : ""}
              {report.label}
            </h2>
            <p className="text-sm text-muted-foreground">
              {format(parseDateParam(report.start), "d MMM yyyy")} –{" "}
              {format(parseDateParam(report.end), "d MMM yyyy")}
              {!isStatement &&
                ` · ${report.employee_count} employees · ${report.meetings_held} meetings held`}
            </p>
          </div>

          <AttendanceSummaryStats summary={report.totals} detailed />

          <Card>
            <CardHeader>
              <CardTitle>Attendance trend</CardTitle>
              <CardDescription>
                Scheduled days by {report.bucket}: on time, late and absent.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceTrendChart trend={report.trend} />
            </CardContent>
          </Card>

          {isStatement && report.days ? (
            <Card>
              <CardHeader>
                <CardTitle>Daily log</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyLog days={report.days} />
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Employee breakdown</CardTitle>
                  <CardDescription>
                    Click a name to open that employee&apos;s statement.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmployeeAttendanceTable rows={report.rows} onSelectEmployee={setScope} />
                </CardContent>
              </Card>
              <Highlights highlights={report.highlights} />
            </>
          )}
        </>
      )}
    </div>
  );
};
