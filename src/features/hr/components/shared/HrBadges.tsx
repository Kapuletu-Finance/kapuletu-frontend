import { Building2, Moon, Video } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import type {
  AttendanceDayStatus,
  DayMode,
  MeetingAttendanceMark,
  MeetingRsvpStatus,
} from "@/features/hr/types";
import { DAY_MODE_LABELS } from "@/features/hr/utils";
import { cn } from "@/lib/utils";

type Tone = "green" | "amber" | "red" | "blue" | "violet" | "slate";

const TONE_CLASSES: Record<Tone, string> = {
  amber:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  green:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  red: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  slate: "bg-muted text-muted-foreground border-border",
  violet:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
};

/** Text + background classes for a tone; also used by the register grid cells. */
export const toneClasses = (tone: Tone) => TONE_CLASSES[tone];

const ToneBadge: React.FC<{ tone: Tone; className?: string; children: React.ReactNode }> = ({
  tone,
  className,
  children,
}) => (
  <Badge variant="outline" className={cn("font-medium", TONE_CLASSES[tone], className)}>
    {children}
  </Badge>
);

export const ATTENDANCE_STATUS_META: Record<
  AttendanceDayStatus,
  { label: string; short: string; tone: Tone }
> = {
  absent: { label: "Absent", short: "A", tone: "red" },
  excused: { label: "Excused", short: "E", tone: "blue" },
  late: { label: "Late", short: "L", tone: "amber" },
  off: { label: "Off", short: "–", tone: "slate" },
  present: { label: "Present", short: "P", tone: "green" },
  upcoming: { label: "Upcoming", short: "·", tone: "slate" },
};

export const AttendanceStatusBadge: React.FC<{ status: AttendanceDayStatus }> = ({ status }) => (
  <ToneBadge tone={ATTENDANCE_STATUS_META[status].tone}>
    {ATTENDANCE_STATUS_META[status].label}
  </ToneBadge>
);

const MODE_META: Record<DayMode, { icon: React.ElementType; tone: Tone }> = {
  off: { icon: Moon, tone: "slate" },
  online: { icon: Video, tone: "blue" },
  physical: { icon: Building2, tone: "violet" },
};

/** Work mode for a day ("Physical" / "Online" / "Off") or a meeting type. */
export const WorkModeBadge: React.FC<{ mode: DayMode; label?: string; className?: string }> = ({
  mode,
  label,
  className,
}) => {
  const { icon: Icon, tone } = MODE_META[mode];
  return (
    <ToneBadge tone={tone} className={className}>
      <Icon />
      {label ?? DAY_MODE_LABELS[mode]}
    </ToneBadge>
  );
};

const MEETING_ATTENDANCE_META: Record<MeetingAttendanceMark, { label: string; tone: Tone }> = {
  attended: { label: "Attended", tone: "green" },
  excused: { label: "Excused", tone: "blue" },
  missed: { label: "Missed", tone: "red" },
};

/** Meeting attendance choices as Select items: { attended: "Attended", ... }. */
export const MEETING_ATTENDANCE_LABELS = Object.fromEntries(
  Object.entries(MEETING_ATTENDANCE_META).map(([mark, meta]) => [mark, meta.label]),
) as Record<MeetingAttendanceMark, string>;

export const MeetingAttendanceBadge: React.FC<{ attendance: MeetingAttendanceMark | null }> = ({
  attendance,
}) =>
  attendance ? (
    <ToneBadge tone={MEETING_ATTENDANCE_META[attendance].tone}>
      {MEETING_ATTENDANCE_META[attendance].label}
    </ToneBadge>
  ) : (
    <ToneBadge tone="slate">Not recorded</ToneBadge>
  );

const RSVP_META: Record<MeetingRsvpStatus, { label: string; tone: Tone }> = {
  accepted: { label: "Going", tone: "green" },
  declined: { label: "Declined", tone: "red" },
  invited: { label: "Awaiting reply", tone: "amber" },
};

export const RsvpBadge: React.FC<{ status: MeetingRsvpStatus }> = ({ status }) => (
  <ToneBadge tone={RSVP_META[status].tone}>{RSVP_META[status].label}</ToneBadge>
);

export const CancelledBadge: React.FC = () => <ToneBadge tone="red">Cancelled</ToneBadge>;
