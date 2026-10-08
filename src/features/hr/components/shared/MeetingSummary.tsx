import { Clock, ExternalLink, MapPin } from "lucide-react";
import type React from "react";
import { CancelledBadge, WorkModeBadge } from "@/features/hr/components/shared/HrBadges";
import type { Meeting } from "@/features/hr/types";
import { formatMeetingWindow } from "@/features/hr/utils";

interface MeetingSummaryProps {
  meeting: Meeting;
  /** Extra badges rendered next to the title (e.g. RSVP or attendance). */
  badges?: React.ReactNode;
  showDescription?: boolean;
}

export const MeetingSummary: React.FC<MeetingSummaryProps> = ({
  meeting,
  badges,
  showDescription,
}) => {
  const isOnline = meeting.meeting_type === "online";
  // In person: "<venue> — <room details>"
  const place = [meeting.location?.name, meeting.location_or_url].filter(Boolean).join(" — ");
  return (
    <div className="min-w-0 space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold leading-tight">{meeting.title}</h3>
        <WorkModeBadge mode={meeting.meeting_type} label={isOnline ? "Online" : "In person"} />
        {meeting.status === "cancelled" && <CancelledBadge />}
        {badges}
      </div>
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="h-3.5 w-3.5 shrink-0" />
        {formatMeetingWindow(meeting.start_time, meeting.end_time)}
      </p>
      {isOnline
        ? meeting.location_or_url && (
            <a
              href={meeting.location_or_url}
              target="_blank"
              rel="noreferrer"
              className="flex w-fit items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              Join link
            </a>
          )
        : place && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {place}
            </p>
          )}
      {showDescription && meeting.description && (
        <p className="whitespace-pre-line pt-1 text-sm text-muted-foreground">
          {meeting.description}
        </p>
      )}
    </div>
  );
};
