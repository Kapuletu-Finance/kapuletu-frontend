"use client";

import { CheckCircle2, Clock, MapPin, Video } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toneClasses, WorkModeBadge } from "@/features/hr/components/shared/HrBadges";
import { useClockInMutation, useClockOutMutation } from "@/features/hr/services/mutations";
import { useTodayStatusQuery } from "@/features/hr/services/queries";
import type { EmployeeReport, TodayStatus } from "@/features/hr/types";
import { formatClock, formatTimeOfDay } from "@/features/hr/utils";
import { cn } from "@/lib/utils";

const SHIFT_GOAL_SECONDS = 8 * 3600;

const formatDuration = (totalSeconds: number) =>
  [Math.floor(totalSeconds / 3600), Math.floor((totalSeconds % 3600) / 60), totalSeconds % 60]
    .map((n) => n.toString().padStart(2, "0"))
    .join(":");

const useElapsedSeconds = (since: string | null) => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!since) return;
    const tick = () => setElapsed(Math.floor((Date.now() - new Date(since).getTime()) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [since]);
  return elapsed;
};

export const ShiftCard: React.FC = () => {
  const { data: today, isLoading } = useTodayStatusQuery();
  const report = today?.report ?? null;
  const isClockedIn = !!report?.clock_in_time;
  const isClockedOut = !!report?.clock_out_time;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> My shift
          </span>
          {today && <WorkModeBadge mode={today.day.mode} />}
        </CardTitle>
        <CardDescription>
          {today?.day.start_time
            ? `Today: starts ${formatClock(today.day.start_time)} · clock-in closes ${formatClock(today.day.cutoff_time)} (EAT)`
            : "Your daily attendance and end-of-shift report."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || !today ? (
          <Skeleton className="h-56 w-full" />
        ) : !isClockedIn ? (
          <ClockInPanel today={today} />
        ) : !isClockedOut ? (
          <ActiveShiftPanel report={report as EmployeeReport} />
        ) : (
          <CompletedShiftPanel report={report as EmployeeReport} />
        )}
      </CardContent>
    </Card>
  );
};

const ClockInPanel: React.FC<{ today: TodayStatus }> = ({ today }) => {
  const clockIn = useClockInMutation();
  const isPhysical = today.day.mode === "physical";
  // The backend already blocks clock-in (with a message) when a physical day has no location.
  const venue = today.day.location;

  return (
    <div className="flex flex-col items-center space-y-5 py-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        {isPhysical ? <MapPin className="h-8 w-8" /> : <Video className="h-8 w-8" />}
      </div>
      {today.can_clock_in ? (
        <>
          <div>
            <h3 className="text-xl font-semibold tracking-tight">
              {isPhysical ? "In-person day" : "Online day"}
            </h3>
            <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
              {isPhysical && venue ? (
                <>
                  Clock in at <strong className="text-foreground">{venue.name}</strong>. Your
                  location must be within {venue.radius_meters} m.
                </>
              ) : (
                "Clock in from wherever you're working today."
              )}
            </p>
            {today.day.reason && (
              <p className="mt-2 text-xs text-muted-foreground">Note: {today.day.reason}</p>
            )}
          </div>
          <Button
            onClick={() => clockIn.mutate({ requiresLocation: isPhysical })}
            disabled={clockIn.isPending}
          >
            {clockIn.isPending
              ? "Verifying..."
              : isPhysical && venue
                ? `Clock in at ${venue.name}`
                : "Start shift"}
          </Button>
        </>
      ) : (
        <div>
          <h3 className="text-xl font-semibold tracking-tight">
            {today.day.mode === "off" ? "No shift today" : "Clock-in unavailable"}
          </h3>
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">{today.message}</p>
        </div>
      )}
    </div>
  );
};

const ActiveShiftPanel: React.FC<{ report: EmployeeReport }> = ({ report }) => {
  const elapsed = useElapsedSeconds(report.clock_in_time);
  const clockOut = useClockOutMutation();
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const progress = Math.min((elapsed / SHIFT_GOAL_SECONDS) * 100, 100);

  return (
    <div className="space-y-6 py-2">
      <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 py-6">
        <p className="mb-2 text-sm font-medium text-muted-foreground">Elapsed time</p>
        <p className="text-4xl font-bold tabular-nums tracking-tight">{formatDuration(elapsed)}</p>
        {report.is_late && (
          <Badge variant="outline" className={cn("mt-3", toneClasses("amber"))}>
            Clocked in late
          </Badge>
        )}
      </div>
      <div className="space-y-2 px-2">
        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          <span>Shift progress</span>
          <span>{Math.floor(progress)}% (goal: 8h)</span>
        </div>
        <Progress value={progress} className="h-2.5" />
        <p className="text-right text-xs text-muted-foreground">
          Started at {formatTimeOfDay(report.clock_in_time)}
        </p>
      </div>
      <Button className="w-full" variant="outline" onClick={() => setOpen(true)}>
        End shift
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete your shift</DialogTitle>
            <DialogDescription>
              You have been active for <strong>{formatDuration(elapsed)}</strong>. Summarise what
              you accomplished today before clocking out.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Completed tasks, pending items, blockers..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={5}
            className="resize-none"
            autoFocus
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={clockOut.isPending || !summary.trim()}
              onClick={() => clockOut.mutate(summary.trim(), { onSuccess: () => setOpen(false) })}
            >
              {clockOut.isPending ? "Submitting..." : "Submit & clock out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CompletedShiftPanel: React.FC<{ report: EmployeeReport }> = ({ report }) => (
  <div className="flex flex-col items-center space-y-4 rounded-2xl border border-dashed bg-muted/20 py-8 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
      <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
    </div>
    <div>
      <h3 className="text-xl font-semibold tracking-tight">Shift completed</h3>
      <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
        {formatTimeOfDay(report.clock_in_time)} – {formatTimeOfDay(report.clock_out_time)}. Your
        report has been sent for review.
      </p>
    </div>
    <div className="flex items-center gap-2 border-t pt-4">
      <span className="text-sm text-muted-foreground">Status:</span>
      <Badge variant={report.status === "confirmed" ? "default" : "secondary"}>
        {report.status.replace("_", " ").toUpperCase()}
      </Badge>
    </div>
  </div>
);
