import {
  addMonths,
  addQuarters,
  addWeeks,
  addYears,
  endOfWeek,
  format,
  getISOWeek,
  getQuarter,
  isSameMonth,
  isSameQuarter,
  isSameWeek,
  isSameYear,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";

export type NavigablePeriod = "week" | "month" | "quarter" | "year";

const WEEK_OPTIONS = { weekStartsOn: 1 } as const; // Monday, matching the work schedule

const PERIODS: Record<
  NavigablePeriod,
  {
    step: (date: Date, amount: number) => Date;
    same: (a: Date, b: Date) => boolean;
    label: (date: Date) => string;
  }
> = {
  month: { label: (d) => format(d, "MMMM yyyy"), same: isSameMonth, step: addMonths },
  quarter: {
    label: (d) => `Q${getQuarter(d)} ${format(d, "yyyy")}`,
    same: isSameQuarter,
    step: addQuarters,
  },
  week: {
    label: (d) =>
      `Week ${getISOWeek(d)} · ${format(startOfWeek(d, WEEK_OPTIONS), "d MMM")} – ${format(endOfWeek(d, WEEK_OPTIONS), "d MMM yyyy")}`,
    same: (a, b) => isSameWeek(a, b, WEEK_OPTIONS),
    step: addWeeks,
  },
  year: { label: (d) => format(d, "yyyy"), same: isSameYear, step: addYears },
};

interface PeriodNavigatorProps {
  period: NavigablePeriod;
  date: Date;
  onChange: (date: Date) => void;
}

/** Previous / next navigation for a week, month, quarter or year, with a jump back to the current one. */
export const PeriodNavigator: React.FC<PeriodNavigatorProps> = ({ period, date, onChange }) => {
  const { label, same, step } = PERIODS[period];
  const isCurrent = same(date, new Date());
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        aria-label={`Previous ${period}`}
        onClick={() => onChange(step(date, -1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-32 px-1 text-center text-sm font-semibold">{label(date)}</span>
      <Button
        variant="outline"
        size="icon"
        aria-label={`Next ${period}`}
        onClick={() => onChange(step(date, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      {!isCurrent && (
        <Button variant="ghost" size="sm" onClick={() => onChange(new Date())}>
          Current
        </Button>
      )}
    </div>
  );
};
