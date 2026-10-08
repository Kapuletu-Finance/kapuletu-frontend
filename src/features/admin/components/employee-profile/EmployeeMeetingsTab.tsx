"use client";

import { Calendar } from "lucide-react";
import type React from "react";
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MEETING_ATTENDANCE_LABELS,
  MeetingAttendanceBadge,
  RsvpBadge,
} from "@/features/hr/components/shared/HrBadges";
import { MeetingSummary } from "@/features/hr/components/shared/MeetingSummary";
import { useMarkAttendanceMutation } from "@/features/hr/services/mutations";
import { useEmployeeMeetingsQuery } from "@/features/hr/services/queries";
import type { MeetingAttendanceMark, MyMeeting } from "@/features/hr/types";

const CHECK_IN_LEAD_MS = 15 * 60 * 1000;

/** Attended/missed can be recorded once the meeting is under way; excused at any time. */
const markOptions = (meeting: MyMeeting) => {
  const started = Date.now() >= new Date(meeting.start_time).getTime() - CHECK_IN_LEAD_MS;
  return (Object.keys(MEETING_ATTENDANCE_LABELS) as MeetingAttendanceMark[]).filter(
    (mark) => started || mark === "excused",
  );
};

const AttendanceControl: React.FC<{ meeting: MyMeeting; userId: string }> = ({
  meeting,
  userId,
}) => {
  const mark = useMarkAttendanceMutation();
  if (meeting.status === "cancelled") return null;
  return (
    <Select
      items={MEETING_ATTENDANCE_LABELS}
      value={meeting.my_attendance}
      disabled={mark.isPending}
      onValueChange={(value) =>
        value &&
        mark.mutate({
          meetingId: meeting.id,
          records: [{ attendance: value as MeetingAttendanceMark, user_id: userId }],
        })
      }
    >
      <SelectTrigger size="sm" className="w-36">
        <SelectValue placeholder="Record attendance" />
      </SelectTrigger>
      <SelectContent>
        {markOptions(meeting).map((option) => (
          <SelectItem key={option} value={option}>
            {MEETING_ATTENDANCE_LABELS[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const EmployeeMeetingsTab: React.FC<{ userId: string }> = ({ userId }) => {
  const { data: meetings, isLoading } = useEmployeeMeetingsQuery(userId);

  const { upcoming, past, counts } = useMemo(() => {
    const now = Date.now();
    const list = meetings ?? [];
    const pastMeetings = list
      .filter((m) => new Date(m.end_time).getTime() < now && m.status !== "cancelled")
      .reverse();
    return {
      counts: {
        attended: pastMeetings.filter((m) => m.my_attendance === "attended").length,
        excused: pastMeetings.filter((m) => m.my_attendance === "excused").length,
        missed: pastMeetings.filter((m) => m.my_attendance === "missed").length,
      },
      past: pastMeetings,
      upcoming: list.filter((m) => new Date(m.end_time).getTime() >= now),
    };
  }, [meetings]);

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  const renderList = (list: MyMeeting[], empty: string, showRsvp: boolean) =>
    list.length === 0 ? (
      <p className="py-6 text-center text-sm text-muted-foreground">{empty}</p>
    ) : (
      <div className="space-y-3">
        {list.map((meeting) => (
          <div
            key={meeting.id}
            className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <MeetingSummary
              meeting={meeting}
              badges={
                meeting.status === "cancelled" ? null : showRsvp ? (
                  <RsvpBadge status={meeting.my_status} />
                ) : (
                  <MeetingAttendanceBadge attendance={meeting.my_attendance} />
                )
              }
            />
            <AttendanceControl meeting={meeting} userId={userId} />
          </div>
        ))}
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {(["attended", "missed", "excused"] as const).map((key) => (
          <div key={key} className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs font-medium text-muted-foreground">
              {MEETING_ATTENDANCE_LABELS[key]}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{counts[key]}</p>
          </div>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Upcoming
          </CardTitle>
          <CardDescription>
            Invitations and their response. You can excuse them in advance.
          </CardDescription>
        </CardHeader>
        <CardContent>{renderList(upcoming, "No upcoming meetings.", true)}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>
            Past meetings and recorded attendance. Adjust any record if needed.
          </CardDescription>
        </CardHeader>
        <CardContent>{renderList(past, "No past meetings yet.", false)}</CardContent>
      </Card>
    </div>
  );
};
