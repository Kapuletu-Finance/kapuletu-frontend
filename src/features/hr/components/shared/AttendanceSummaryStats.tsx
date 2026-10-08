import type React from "react";
import type { AttendanceSummary } from "@/features/hr/types";

const formatRate = (rate: number | null) => (rate === null ? "—" : `${rate}%`);

interface Stat {
  label: string;
  value: string | number;
  hint: string;
}

const coreStats = (summary: AttendanceSummary): Stat[] => [
  {
    hint: `${summary.present + summary.late} of ${summary.scheduled_days} scheduled days`,
    label: "Attendance",
    value: formatRate(summary.attendance_rate),
  },
  {
    hint: "Days in the office",
    label: "Physical days",
    value: `${summary.physical_attended}/${summary.physical_expected}`,
  },
  { hint: `${summary.absent} absent`, label: "Late arrivals", value: summary.late },
  {
    hint: `${summary.meetings.attended} of ${summary.meetings.invited} meetings`,
    label: "Meetings",
    value: formatRate(summary.meetings.attendance_rate),
  },
];

const detailedStats = (summary: AttendanceSummary): Stat[] => [
  {
    hint: "Attended days that started on time",
    label: "Punctuality",
    value: formatRate(summary.punctuality_rate),
  },
  {
    hint: `${summary.excused} excused day(s) not counted`,
    label: "Absences",
    value: summary.absent,
  },
  { hint: "Completed shifts", label: "Hours worked", value: summary.hours_worked },
  {
    hint: `${summary.reports_confirmed} reports confirmed · ${summary.reports_pending} pending`,
    label: "Average clock-in",
    value: summary.avg_clock_in ?? "—",
  },
];

/**
 * Summary tiles shared by the employee history, register drill-downs and admin reports.
 * `detailed` adds punctuality, absences, hours and average clock-in.
 */
export const AttendanceSummaryStats: React.FC<{
  summary: AttendanceSummary;
  detailed?: boolean;
}> = ({ summary, detailed }) => {
  const stats = detailed ? [...coreStats(summary), ...detailedStats(summary)] : coreStats(summary);
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border bg-muted/20 p-3">
          <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{stat.value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{stat.hint}</p>
        </div>
      ))}
    </div>
  );
};
