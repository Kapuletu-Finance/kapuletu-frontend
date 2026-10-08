"use client";

import { CalendarPlus, Users } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MeetingFormDialog } from "@/features/hr/components/admin/meetings/MeetingFormDialog";
import { MeetingRosterSheet } from "@/features/hr/components/admin/meetings/MeetingRosterSheet";
import { MeetingSummary } from "@/features/hr/components/shared/MeetingSummary";
import { SegmentedControl } from "@/features/hr/components/shared/SegmentedControl";
import { useAllMeetingsQuery } from "@/features/hr/services/queries";
import type { AdminMeeting, MeetingDetail } from "@/features/hr/types";
import EmptyState from "@/features/shared/components/EmptyState";

type MeetingFilter = "upcoming" | "past" | "cancelled";

const FILTERS: { value: MeetingFilter; label: string }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Past", value: "past" },
  { label: "Cancelled", value: "cancelled" },
];

const matchesFilter = (meeting: AdminMeeting, filter: MeetingFilter, now: number) => {
  if (filter === "cancelled") return meeting.status === "cancelled";
  if (meeting.status === "cancelled") return false;
  const ended = new Date(meeting.end_time).getTime() < now;
  return filter === "past" ? ended : !ended;
};

const MeetingCountsLine: React.FC<{ meeting: AdminMeeting; isPast: boolean }> = ({
  meeting,
  isPast,
}) => {
  const { counts } = meeting;
  return (
    <p className="text-sm text-muted-foreground">
      <Users className="mr-1.5 inline h-3.5 w-3.5" />
      {isPast
        ? `${counts.attended} attended · ${counts.missed} missed · ${counts.excused} excused of ${counts.total}`
        : `${counts.accepted} going · ${counts.declined} declined · ${counts.total - counts.accepted - counts.declined} awaiting of ${counts.total}`}
    </p>
  );
};

export const MeetingsTab: React.FC = () => {
  const { data: meetings, isLoading } = useAllMeetingsQuery();
  const [filter, setFilter] = useState<MeetingFilter>("upcoming");
  const [search, setSearch] = useState("");
  const [rosterId, setRosterId] = useState<string | null>(null);
  const [form, setForm] = useState<{ open: boolean; meeting?: MeetingDetail }>({ open: false });

  const visible = useMemo(() => {
    const now = Date.now();
    const q = search.trim().toLowerCase();
    const list = (meetings ?? []).filter(
      (m) => matchesFilter(m, filter, now) && (!q || m.title.toLowerCase().includes(q)),
    );
    // Upcoming: soonest first. Past/cancelled: most recent first (API order).
    return filter === "upcoming" ? [...list].reverse() : list;
  }, [meetings, filter, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meetings"
            className="h-9 w-48"
          />
        </div>
        <Button onClick={() => setForm({ open: true })} className="gap-2">
          <CalendarPlus className="h-4 w-4" /> Schedule meeting
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : visible.length === 0 ? (
        <Card>
          <EmptyState message={`No ${filter} meetings.`} />
        </Card>
      ) : (
        <div className="space-y-3">
          {visible.map((meeting) => (
            <Card key={meeting.id}>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <MeetingSummary meeting={meeting} />
                  <MeetingCountsLine meeting={meeting} isPast={filter !== "upcoming"} />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => setRosterId(meeting.id)}
                >
                  {filter === "upcoming" ? "Manage" : "Attendance"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <MeetingRosterSheet
        meetingId={rosterId}
        onClose={() => setRosterId(null)}
        onEdit={(meeting) => {
          setRosterId(null);
          setForm({ meeting, open: true });
        }}
      />
      {form.open && (
        <MeetingFormDialog
          key={form.meeting?.id ?? "new"}
          open={form.open}
          meeting={form.meeting}
          onOpenChange={(open) => !open && setForm({ open: false })}
        />
      )}
    </div>
  );
};
