"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AttendanceReport, AttendanceSummary, EmployeeBrief } from "@/features/hr/types";
import { formatRole } from "@/features/hr/utils";

type Row = AttendanceReport["rows"][number];

interface Column {
  key: string;
  label: string;
  value: (row: Row) => number | string;
  display?: (summary: AttendanceSummary) => React.ReactNode;
}

const rate = (value: number | null) => (value === null ? "—" : `${value}%`);
const name = (e: EmployeeBrief) => `${e.first_name} ${e.last_name}`;

const COLUMNS: Column[] = [
  { key: "scheduled", label: "Scheduled", value: (r) => r.summary.scheduled_days },
  { key: "present", label: "Present", value: (r) => r.summary.present },
  { key: "late", label: "Late", value: (r) => r.summary.late },
  { key: "absent", label: "Absent", value: (r) => r.summary.absent },
  { key: "excused", label: "Excused", value: (r) => r.summary.excused },
  {
    display: (s) => rate(s.attendance_rate),
    key: "attendance",
    label: "Attendance",
    value: (r) => r.summary.attendance_rate ?? -1,
  },
  {
    display: (s) => rate(s.punctuality_rate),
    key: "punctuality",
    label: "Punctuality",
    value: (r) => r.summary.punctuality_rate ?? -1,
  },
  {
    display: (s) => `${s.physical_attended}/${s.physical_expected}`,
    key: "office",
    label: "Office days",
    value: (r) => r.summary.physical_attended,
  },
  { key: "hours", label: "Hours", value: (r) => r.summary.hours_worked },
  {
    display: (s) => s.avg_clock_in ?? "—",
    key: "avgIn",
    label: "Avg in",
    value: (r) => r.summary.avg_clock_in ?? "99:99",
  },
  {
    display: (s) => `${s.meetings.attended}/${s.meetings.invited}`,
    key: "meetings",
    label: "Meetings",
    value: (r) => r.summary.meetings.attendance_rate ?? -1,
  },
];

interface EmployeeAttendanceTableProps {
  rows: Row[];
  onSelectEmployee: (userId: string) => void;
}

/** Per-employee breakdown; click a header to sort, click a name for that employee's statement. */
export const EmployeeAttendanceTable: React.FC<EmployeeAttendanceTableProps> = ({
  rows,
  onSelectEmployee,
}) => {
  const [sort, setSort] = useState<{ key: string; desc: boolean }>({
    desc: true,
    key: "attendance",
  });

  const sorted = useMemo(() => {
    const column = COLUMNS.find((c) => c.key === sort.key);
    const value = column ? column.value : (r: Row) => name(r.employee);
    return [...rows].sort((a, b) => {
      const [x, y] = [value(a), value(b)];
      const order =
        typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
      return sort.desc ? -order : order;
    });
  }, [rows, sort]);

  const header = (key: string, label: string, alignRight = true) => (
    <TableHead className={alignRight ? "text-right" : undefined}>
      <button
        type="button"
        className="inline-flex items-center gap-1 font-medium hover:text-foreground"
        onClick={() => setSort((prev) => ({ desc: prev.key === key ? !prev.desc : true, key }))}
      >
        {label}
        {sort.key === key &&
          (sort.desc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)}
      </button>
    </TableHead>
  );

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {header("name", "Employee", false)}
            {COLUMNS.map((c) => header(c.key, c.label))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => (
            <TableRow key={row.employee.user_id}>
              <TableCell>
                <button
                  type="button"
                  className="text-left font-medium hover:underline"
                  onClick={() => onSelectEmployee(row.employee.user_id)}
                >
                  {name(row.employee)}
                </button>
                <p className="text-xs text-muted-foreground">{formatRole(row.employee.role)}</p>
              </TableCell>
              {COLUMNS.map((c) => (
                <TableCell key={c.key} className="text-right tabular-nums">
                  {c.display ? c.display(row.summary) : c.value(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
