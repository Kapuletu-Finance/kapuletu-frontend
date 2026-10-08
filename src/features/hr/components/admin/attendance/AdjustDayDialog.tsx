"use client";

import { format } from "date-fns";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AttendanceStatusBadge, WorkModeBadge } from "@/features/hr/components/shared/HrBadges";
import { SegmentedControl } from "@/features/hr/components/shared/SegmentedControl";
import {
  useRevertAdjustmentMutation,
  useSaveAdjustmentMutation,
} from "@/features/hr/services/mutations";
import type { AdjustmentStatus, AttendanceDay, EmployeeBrief } from "@/features/hr/types";
import { eatDateTime, parseDateParam, toEatTime } from "@/features/hr/utils";

const STATUS_OPTIONS: { value: AdjustmentStatus; label: string }[] = [
  { label: "Present", value: "present" },
  { label: "Late", value: "late" },
  { label: "Absent", value: "absent" },
  { label: "Excused", value: "excused" },
];

const ADJUSTABLE = new Set<string>(STATUS_OPTIONS.map((o) => o.value));

interface AdjustDayDialogProps {
  employee: EmployeeBrief;
  day: AttendanceDay;
  onClose: () => void;
}

/** Correct one employee's day (e.g. excused sick leave, failed GPS); the recorded clock-in is kept. */
export const AdjustDayDialog: React.FC<AdjustDayDialogProps> = ({ employee, day, onClose }) => {
  const [status, setStatus] = useState<AdjustmentStatus>(
    ADJUSTABLE.has(day.status) ? (day.status as AdjustmentStatus) : "present",
  );
  const [reason, setReason] = useState(day.adjustment_reason ?? "");
  const [clockIn, setClockIn] = useState(toEatTime(day.clock_in_time));
  const [clockOut, setClockOut] = useState(toEatTime(day.clock_out_time));
  const save = useSaveAdjustmentMutation();
  const revert = useRevertAdjustmentMutation();

  const attended = status === "present" || status === "late";
  const timesInvalid = attended && clockIn && clockOut && clockOut <= clockIn;
  const canSave = reason.trim().length >= 3 && !timesInvalid;

  const handleSave = () =>
    save.mutate(
      {
        clock_in_time: attended && clockIn ? eatDateTime(day.date, clockIn) : null,
        clock_out_time: attended && clockOut ? eatDateTime(day.date, clockOut) : null,
        date: day.date,
        reason: reason.trim(),
        status,
        user_id: employee.user_id,
      },
      { onSuccess: onClose },
    );

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Correct attendance</DialogTitle>
          <DialogDescription>
            {employee.first_name} {employee.last_name} ·{" "}
            {format(parseDateParam(day.date), "EEEE d MMMM yyyy")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            Currently <AttendanceStatusBadge status={day.status} /> on a{" "}
            <WorkModeBadge mode={day.mode} /> day
            {day.adjusted && <span>(already corrected)</span>}
          </div>

          <div className="space-y-1.5">
            <Label>Set to</Label>
            <SegmentedControl
              className="flex w-full"
              options={STATUS_OPTIONS}
              value={status}
              onChange={setStatus}
            />
            {status === "excused" && (
              <p className="text-xs text-muted-foreground">
                Excused days don&apos;t count against attendance or punctuality.
              </p>
            )}
          </div>

          {attended && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="adjust-in">Clock in (EAT)</Label>
                <Input
                  id="adjust-in"
                  type="time"
                  value={clockIn}
                  onChange={(e) => setClockIn(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="adjust-out">Clock out (EAT)</Label>
                <Input
                  id="adjust-out"
                  type="time"
                  value={clockOut}
                  onChange={(e) => setClockOut(e.target.value)}
                />
              </div>
              {timesInvalid && (
                <p className="col-span-2 text-xs font-medium text-destructive">
                  Clock out must be after clock in.
                </p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="adjust-reason">Reason (shared with the employee)</Label>
            <Textarea
              id="adjust-reason"
              rows={3}
              maxLength={500}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Sick leave — note received / GPS failed, confirmed at the office by the supervisor"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          {day.adjusted ? (
            <Button
              variant="ghost"
              disabled={revert.isPending}
              onClick={() =>
                revert.mutate({ date: day.date, userId: employee.user_id }, { onSuccess: onClose })
              }
            >
              Revert to recorded
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={!canSave || save.isPending} onClick={handleSave}>
              {save.isPending ? "Saving..." : "Save correction"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
