"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentedControl } from "@/features/hr/components/shared/SegmentedControl";
import type { DayMode, ScheduleDay } from "@/features/hr/types";
import { DAY_MODE_LABELS, formatClock, toApiTime, WEEKDAY_LABELS } from "@/features/hr/utils";

type RowMode = DayMode | "inherit";

interface EditorRow {
  weekday: number;
  mode: RowMode;
  start: string; // "HH:MM"
  cutoff: string;
}

interface WeeklyScheduleEditorProps {
  /** Saved rows. For the company pattern this has all 7 weekdays; for an employee only their overrides. */
  days: ScheduleDay[];
  /**
   * The company pattern. When provided, weekdays without a saved row show as "Same as company"
   * and only differing weekdays are saved (employee mode).
   */
  inheritFrom?: ScheduleDay[];
  onSave: (days: ScheduleDay[]) => void;
  isSaving: boolean;
}

const MODE_OPTIONS = (["physical", "online", "off"] as const).map((mode) => ({
  label: DAY_MODE_LABELS[mode],
  value: mode as RowMode,
}));
const INHERIT_OPTIONS = [{ label: "Company", value: "inherit" as RowMode }, ...MODE_OPTIONS];

const buildRows = (days: ScheduleDay[], inheritFrom?: ScheduleDay[]): EditorRow[] =>
  WEEKDAY_LABELS.map((_, weekday) => {
    const saved = days.find((d) => d.weekday === weekday);
    const base = saved ?? inheritFrom?.find((d) => d.weekday === weekday);
    return {
      cutoff: formatClock(base?.cutoff_time ?? "11:00"),
      mode: saved ? saved.mode : inheritFrom ? "inherit" : "off",
      start: formatClock(base?.start_time ?? "08:00"),
      weekday,
    };
  });

export const WeeklyScheduleEditor: React.FC<WeeklyScheduleEditorProps> = ({
  days,
  inheritFrom,
  onSave,
  isSaving,
}) => {
  const [rows, setRows] = useState(() => buildRows(days, inheritFrom));
  const [error, setError] = useState<string | null>(null);

  const updateRow = (weekday: number, patch: Partial<EditorRow>) =>
    setRows((prev) => prev.map((row) => (row.weekday === weekday ? { ...row, ...patch } : row)));

  const handleSave = () => {
    const invalid = rows.find(
      (r) => r.mode !== "inherit" && r.mode !== "off" && r.cutoff < r.start,
    );
    if (invalid) {
      setError(
        `${WEEKDAY_LABELS[invalid.weekday]}: the cut-off cannot be earlier than the start time.`,
      );
      return;
    }
    setError(null);
    onSave(
      rows
        .filter((r) => r.mode !== "inherit")
        .map((r) => ({
          cutoff_time: toApiTime(r.cutoff),
          mode: r.mode as DayMode,
          start_time: toApiTime(r.start),
          weekday: r.weekday,
        })),
    );
  };

  return (
    <div className="space-y-3">
      <div className="divide-y rounded-lg border">
        {rows.map((row) => {
          const hasTimes = row.mode === "physical" || row.mode === "online";
          return (
            <div
              key={row.weekday}
              className="grid items-center gap-3 p-3 sm:grid-cols-[7rem_minmax(0,1fr)_auto]"
            >
              <span className="text-sm font-medium">{WEEKDAY_LABELS[row.weekday]}</span>
              <SegmentedControl
                size="sm"
                className="w-full max-w-sm"
                options={inheritFrom ? INHERIT_OPTIONS : MODE_OPTIONS}
                value={row.mode}
                onChange={(mode) => updateRow(row.weekday, { mode })}
              />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Label htmlFor={`start-${row.weekday}`} className="text-xs font-normal">
                  Start
                </Label>
                <Input
                  id={`start-${row.weekday}`}
                  type="time"
                  className="h-8 w-28"
                  disabled={!hasTimes}
                  value={row.start}
                  onChange={(e) => updateRow(row.weekday, { start: e.target.value })}
                />
                <Label htmlFor={`cutoff-${row.weekday}`} className="text-xs font-normal">
                  Cut-off
                </Label>
                <Input
                  id={`cutoff-${row.weekday}`}
                  type="time"
                  className="h-8 w-28"
                  disabled={!hasTimes}
                  value={row.cutoff}
                  onChange={(e) => updateRow(row.weekday, { cutoff: e.target.value })}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Clock-ins after the start time are marked late; after the cut-off they are refused. Times
        are East Africa Time.
      </p>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save schedule"}
        </Button>
      </div>
    </div>
  );
};
