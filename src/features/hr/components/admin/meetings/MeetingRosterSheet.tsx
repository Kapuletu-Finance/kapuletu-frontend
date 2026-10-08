"use client";

import type React from "react";
import { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MEETING_ATTENDANCE_LABELS, RsvpBadge } from "@/features/hr/components/shared/HrBadges";
import { MeetingSummary } from "@/features/hr/components/shared/MeetingSummary";
import {
  useCancelMeetingMutation,
  useMarkAttendanceMutation,
} from "@/features/hr/services/mutations";
import { useMeetingDetailQuery } from "@/features/hr/services/queries";
import type { MeetingAttendanceMark, MeetingDetail } from "@/features/hr/types";
import { formatRole, formatTimeOfDay } from "@/features/hr/utils";

const CHECK_IN_LEAD_MS = 15 * 60 * 1000;

interface MeetingRosterSheetProps {
  meetingId: string | null;
  onClose: () => void;
  onEdit: (meeting: MeetingDetail) => void;
}

export const MeetingRosterSheet: React.FC<MeetingRosterSheetProps> = ({
  meetingId,
  onClose,
  onEdit,
}) => {
  const { data: meeting, isLoading } = useMeetingDetailQuery(meetingId ?? undefined);

  return (
    <Sheet open={!!meetingId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Meeting roster</SheetTitle>
          <SheetDescription>Responses, check-ins and attendance for this meeting.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6">
          {isLoading || !meeting ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            // Keyed so the attendance draft resets whenever fresh data arrives for another meeting.
            <RosterBody key={meeting.id} meeting={meeting} onEdit={onEdit} onCancelled={onClose} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const RosterBody: React.FC<{
  meeting: MeetingDetail;
  onEdit: (meeting: MeetingDetail) => void;
  onCancelled: () => void;
}> = ({ meeting, onEdit, onCancelled }) => {
  const markMutation = useMarkAttendanceMutation();
  const cancelMutation = useCancelMeetingMutation();
  const [draft, setDraft] = useState<Record<string, MeetingAttendanceMark | null>>(() =>
    Object.fromEntries(meeting.attendees.map((a) => [a.user_id, a.attendance])),
  );

  const now = Date.now();
  const isOpen = meeting.status === "scheduled" && new Date(meeting.end_time).getTime() > now;
  const hasStarted = now >= new Date(meeting.start_time).getTime() - CHECK_IN_LEAD_MS;

  const changes = useMemo(
    () =>
      meeting.attendees
        .filter((a) => draft[a.user_id] && draft[a.user_id] !== a.attendance)
        .map((a) => ({
          attendance: draft[a.user_id] as MeetingAttendanceMark,
          user_id: a.user_id,
        })),
    [draft, meeting.attendees],
  );

  const markUnmarked = (mark: MeetingAttendanceMark) =>
    setDraft((prev) =>
      Object.fromEntries(Object.entries(prev).map(([userId, value]) => [userId, value ?? mark])),
    );

  const { counts } = meeting;
  const countItems = [
    ["Invited", counts.total],
    ["Going", counts.accepted],
    ["Declined", counts.declined],
    ["Attended", counts.attended],
    ["Missed", counts.missed],
    ["Excused", counts.excused],
  ] as const;

  return (
    <div className="space-y-5">
      <MeetingSummary meeting={meeting} showDescription />

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {countItems.map(([label, value]) => (
          <div key={label} className="rounded-md border bg-muted/20 p-2 text-center">
            <p className="text-lg font-bold tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(meeting)}>
            Edit meeting
          </Button>
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="outline" size="sm" className="text-destructive" />}
            >
              Cancel meeting
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel “{meeting.title}”?</AlertDialogTitle>
                <AlertDialogDescription>
                  All {counts.total} invitees will be notified by email and in-app. This cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep meeting</AlertDialogCancel>
                <AlertDialogAction
                  disabled={cancelMutation.isPending}
                  onClick={() => cancelMutation.mutate(meeting.id, { onSuccess: onCancelled })}
                >
                  Cancel meeting
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {meeting.status === "scheduled" && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {hasStarted
              ? "Self check-ins are recorded automatically. Adjust anyone below."
              : "Before the meeting starts you can only excuse people in advance."}
          </p>
          {hasStarted && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => markUnmarked("attended")}>
                Unmarked → attended
              </Button>
              <Button variant="ghost" size="sm" onClick={() => markUnmarked("missed")}>
                Unmarked → missed
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Attendee</TableHead>
              <TableHead>Response</TableHead>
              <TableHead>Checked in</TableHead>
              <TableHead className="w-36">Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meeting.attendees.map((attendee) => (
              <TableRow key={attendee.user_id}>
                <TableCell>
                  <p className="font-medium">
                    {attendee.first_name} {attendee.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatRole(attendee.role)}</p>
                </TableCell>
                <TableCell>
                  <RsvpBadge status={attendee.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatTimeOfDay(attendee.checked_in_at)}
                </TableCell>
                <TableCell>
                  <Select
                    items={MEETING_ATTENDANCE_LABELS}
                    value={draft[attendee.user_id]}
                    disabled={meeting.status === "cancelled"}
                    onValueChange={(value) =>
                      setDraft((prev) => ({
                        ...prev,
                        [attendee.user_id]: value as MeetingAttendanceMark | null,
                      }))
                    }
                  >
                    <SelectTrigger size="sm" className="w-full">
                      <SelectValue placeholder="Not recorded" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(MEETING_ATTENDANCE_LABELS) as MeetingAttendanceMark[]).map(
                        (mark) => (
                          <SelectItem
                            key={mark}
                            value={mark}
                            disabled={!hasStarted && mark !== "excused"}
                          >
                            {MEETING_ATTENDANCE_LABELS[mark]}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {meeting.status === "scheduled" && (
        <div className="flex justify-end">
          <Button
            disabled={changes.length === 0 || markMutation.isPending}
            onClick={() => markMutation.mutate({ meetingId: meeting.id, records: changes })}
          >
            {markMutation.isPending
              ? "Saving..."
              : `Save attendance${changes.length ? ` (${changes.length})` : ""}`}
          </Button>
        </div>
      )}
    </div>
  );
};
