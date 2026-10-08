"use client";

import { Calendar } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MeetingAttendanceBadge, RsvpBadge } from "@/features/hr/components/shared/HrBadges";
import { MeetingSummary } from "@/features/hr/components/shared/MeetingSummary";
import { SegmentedControl } from "@/features/hr/components/shared/SegmentedControl";
import { useMeetingCheckInMutation, useRsvpMutation } from "@/features/hr/services/mutations";
import { useMyMeetingsQuery } from "@/features/hr/services/queries";
import type { MyMeeting } from "@/features/hr/types";

type View = "upcoming" | "past";
const VIEWS = [
  { label: "Upcoming", value: "upcoming" as View },
  { label: "Past", value: "past" as View },
];

const isEnded = (meeting: MyMeeting) => new Date(meeting.end_time).getTime() < Date.now();

const UpcomingMeetingActions: React.FC<{ meeting: MyMeeting }> = ({ meeting }) => {
  const rsvp = useRsvpMutation();
  const checkIn = useMeetingCheckInMutation();
  if (meeting.status === "cancelled") return null;

  if (meeting.checked_in_at || meeting.my_attendance === "attended") {
    return <MeetingAttendanceBadge attendance="attended" />;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {meeting.can_check_in && (
        <Button
          size="sm"
          disabled={checkIn.isPending}
          onClick={() =>
            checkIn.mutate({
              meetingId: meeting.id,
              requiresLocation: meeting.meeting_type === "physical",
            })
          }
        >
          {checkIn.isPending
            ? "Checking in..."
            : meeting.meeting_type === "physical"
              ? "Check in at office"
              : "Check in"}
        </Button>
      )}
      {meeting.my_status !== "accepted" && (
        <Button
          size="sm"
          variant="outline"
          disabled={rsvp.isPending}
          onClick={() => rsvp.mutate({ meetingId: meeting.id, response: "accepted" })}
        >
          Accept
        </Button>
      )}
      {meeting.my_status !== "declined" && (
        <Button
          size="sm"
          variant="ghost"
          disabled={rsvp.isPending}
          onClick={() => rsvp.mutate({ meetingId: meeting.id, response: "declined" })}
        >
          Decline
        </Button>
      )}
    </div>
  );
};

export const MyMeetingsCard: React.FC = () => {
  const { data: meetings, isLoading } = useMyMeetingsQuery();
  const [view, setView] = useState<View>("upcoming");

  const visible = useMemo(() => {
    const list = meetings ?? [];
    // Upcoming: soonest first; past: most recent first.
    return view === "upcoming" ? list.filter((m) => !isEnded(m)) : list.filter(isEnded).reverse();
  }, [meetings, view]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> My meetings
          </span>
          <SegmentedControl size="sm" options={VIEWS} value={view} onChange={setView} />
        </CardTitle>
        <CardDescription>
          Confirm whether you can attend, and check in when the meeting starts (opens 15 minutes
          before).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : visible.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            <Calendar className="mx-auto mb-3 h-8 w-8 opacity-30" />
            {view === "upcoming" ? "No upcoming meetings." : "No past meetings yet."}
          </div>
        ) : (
          <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
            {visible.map((meeting) => (
              <div key={meeting.id} className="space-y-3 rounded-lg border p-3">
                <MeetingSummary
                  meeting={meeting}
                  showDescription={view === "upcoming"}
                  badges={
                    meeting.status === "cancelled" ? null : view === "upcoming" ? (
                      <RsvpBadge status={meeting.my_status} />
                    ) : (
                      <MeetingAttendanceBadge attendance={meeting.my_attendance} />
                    )
                  }
                />
                {view === "upcoming" && <UpcomingMeetingActions meeting={meeting} />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
