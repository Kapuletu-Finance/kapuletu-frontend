import { format } from "date-fns";
import type React from "react";
import { ATTENDANCE_STATUS_META, toneClasses } from "@/features/hr/components/shared/HrBadges";
import type { AttendanceDay } from "@/features/hr/types";
import { DAY_MODE_LABELS, formatTimeOfDay, parseDateParam } from "@/features/hr/utils";
import { cn } from "@/lib/utils";

/** "Mon 12 Oct · Physical · Late · in 08:42 · out 17:01" — used as the cell tooltip. */
export const describeAttendanceDay = (day: AttendanceDay) => {
  const parts = [
    format(parseDateParam(day.date), "EEE d MMM"),
    DAY_MODE_LABELS[day.mode],
    ATTENDANCE_STATUS_META[day.status].label,
  ];
  if (day.clock_in_time) parts.push(`in ${formatTimeOfDay(day.clock_in_time)}`);
  if (day.clock_out_time) parts.push(`out ${formatTimeOfDay(day.clock_out_time)}`);
  if (day.reason) parts.push(day.reason);
  if (day.adjusted) parts.push(`Adjusted by HR: ${day.adjustment_reason}`);
  return parts.join(" · ");
};

/** Short code: status letter, or the expected mode's initial for upcoming days. */
export const attendanceDayCode = (day: AttendanceDay) =>
  day.status === "upcoming"
    ? DAY_MODE_LABELS[day.mode].charAt(0)
    : ATTENDANCE_STATUS_META[day.status].short;

interface AttendanceDayCellProps {
  day: AttendanceDay;
  className?: string;
  /** Custom content; defaults to the short status code. */
  children?: React.ReactNode;
}

/**
 * A status-coloured tile for one day, shared by the admin register and the employee calendar.
 * Days corrected by HR carry a small corner marker.
 */
export const AttendanceDayCell: React.FC<AttendanceDayCellProps> = ({
  day,
  className,
  children,
}) => (
  <span
    title={describeAttendanceDay(day)}
    className={cn(
      "relative flex items-center justify-center rounded border",
      toneClasses(ATTENDANCE_STATUS_META[day.status].tone),
      day.status === "upcoming" && "opacity-70",
      className,
    )}
  >
    {children ?? attendanceDayCode(day)}
    {day.adjusted && (
      <span
        role="img"
        aria-label="Adjusted by HR"
        className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-foreground ring-2 ring-background"
      />
    )}
  </span>
);
