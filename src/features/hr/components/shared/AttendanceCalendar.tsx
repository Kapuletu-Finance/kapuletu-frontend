import { format } from "date-fns";
import type React from "react";
import { AttendanceDayCell } from "@/features/hr/components/shared/AttendanceDayCell";
import { ATTENDANCE_STATUS_META } from "@/features/hr/components/shared/HrBadges";
import type { AttendanceDay } from "@/features/hr/types";
import {
  DAY_MODE_LABELS,
  formatTimeOfDay,
  parseDateParam,
  toDateParam,
  WEEKDAY_LABELS,
} from "@/features/hr/utils";
import { cn } from "@/lib/utils";

interface AttendanceCalendarProps {
  /** One month (or any range) of days, starting on its first date. */
  days: AttendanceDay[];
  /** When set, past days and today become clickable (e.g. to correct attendance). */
  onDayClick?: (day: AttendanceDay) => void;
}

const DayContent: React.FC<{ day: AttendanceDay }> = ({ day }) => (
  <>
    <span className="text-xs font-semibold">{format(parseDateParam(day.date), "d")}</span>
    <span className={cn("text-[10px] leading-tight", day.status === "off" && "opacity-70")}>
      {day.status === "upcoming" || day.status === "off"
        ? DAY_MODE_LABELS[day.mode]
        : ATTENDANCE_STATUS_META[day.status].label}
      {day.clock_in_time && (
        <span className="hidden sm:block">{formatTimeOfDay(day.clock_in_time)}</span>
      )}
    </span>
  </>
);

const CELL_CLASS = "min-h-16 w-full flex-col items-start justify-between p-1.5 text-left";

/** Monday-first month grid of attendance days, shared by the employee dashboard and admin profiles. */
export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ days, onDayClick }) => {
  if (days.length === 0) return null;
  // Pad the first week so dates land under the right weekday.
  const leadingBlanks = (parseDateParam(days[0].date).getDay() + 6) % 7;
  const today = toDateParam(new Date());

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {WEEKDAY_LABELS.map((label) => (
        <div key={label} className="pb-1 text-center text-xs font-medium text-muted-foreground">
          {label.slice(0, 3)}
        </div>
      ))}
      {Array.from({ length: leadingBlanks }, (_, i) => (
        <div key={`blank-${i}`} />
      ))}
      {days.map((day) =>
        onDayClick && day.date <= today ? (
          <button
            key={day.date}
            type="button"
            className="rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            onClick={() => onDayClick(day)}
          >
            <AttendanceDayCell
              day={day}
              className={cn(CELL_CLASS, "cursor-pointer hover:ring-2 hover:ring-primary/40")}
            >
              <DayContent day={day} />
            </AttendanceDayCell>
          </button>
        ) : (
          <AttendanceDayCell key={day.date} day={day} className={CELL_CLASS}>
            <DayContent day={day} />
          </AttendanceDayCell>
        ),
      )}
    </div>
  );
};
