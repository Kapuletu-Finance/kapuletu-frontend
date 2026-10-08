export type WorkMode = "physical" | "online";
export type DayMode = WorkMode | "off";
export type DaySource =
  | "employee_override"
  | "company_override"
  | "employee_weekly"
  | "company_weekly";
export type AttendanceDayStatus = "present" | "late" | "absent" | "excused" | "off" | "upcoming";
export type AdjustmentStatus = "present" | "late" | "absent" | "excused";
export type MeetingAttendanceMark = "attended" | "missed" | "excused";
export type MeetingRsvpStatus = "invited" | "accepted" | "declined";
export type MeetingAudience = "all" | "roles" | "custom";
export type MeetingStatus = "scheduled" | "cancelled";
export type SummaryPeriod = "week" | "month" | "quarter" | "year" | "custom";
export type TrendBucket = "day" | "week" | "month";

/** GPS coordinates as sent to the API (strings keep full precision). */
export interface Coordinates {
  latitude: string;
  longitude: string;
}

// --- Work locations ---

export interface WorkLocationInput {
  name: string;
  address?: string | null;
  latitude: number;
  longitude: number;
  radius_meters: number;
}

export interface WorkLocation extends WorkLocationInput {
  id: string;
  is_default: boolean;
  is_active: boolean;
}

// --- Daily reports ---

export interface EmployeeReport {
  id: string;
  user_id: string;
  report_date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  work_summary: string | null;
  status: "pending_review" | "confirmed" | "rejected";
  admin_notes: string | null;
  work_mode: WorkMode | null;
  latitude: string | null;
  longitude: string | null;
  is_late: boolean;
  created_at: string;
  updated_at: string;
}

// --- Schedule ---

export interface ScheduleDay {
  weekday: number; // 0 = Monday ... 6 = Sunday
  mode: DayMode;
  start_time: string; // "HH:MM:SS"
  cutoff_time: string;
}

export interface EmployeeSchedule {
  user_id: string;
  days: ScheduleDay[];
}

export interface ScheduleOverride {
  id: string;
  date: string;
  mode: DayMode;
  reason: string | null;
  user_id: string | null;
  employee_name: string | null;
  location_id: string | null;
  location_name: string | null;
  created_at: string | null;
}

export interface ScheduleOverrideInput {
  date: string;
  mode: DayMode;
  reason?: string;
  user_id?: string;
  /** Venue for a physical day; omit for the default location. */
  location_id?: string;
}

export interface ResolvedDay {
  date: string;
  mode: DayMode;
  start_time: string | null;
  cutoff_time: string | null;
  source: DaySource;
  reason: string | null;
  /** Where to be on a physical day (override venue, else the default location). */
  location: WorkLocation | null;
}

export interface TodayStatus {
  day: ResolvedDay;
  report: EmployeeReport | null;
  can_clock_in: boolean;
  message: string | null;
}

// --- Attendance ---

export interface AttendanceDay {
  date: string;
  mode: DayMode;
  status: AttendanceDayStatus;
  clock_in_time: string | null;
  clock_out_time: string | null;
  report_id: string | null;
  report_status: string | null;
  reason: string | null;
  adjusted: boolean;
  adjustment_reason: string | null;
}

export interface MeetingAttendanceSummary {
  invited: number;
  attended: number;
  missed: number;
  excused: number;
  attendance_rate: number | null;
}

export interface AttendanceSummary {
  scheduled_days: number;
  present: number;
  late: number;
  absent: number;
  /** Excused days; excluded from scheduled_days and the rates. */
  excused: number;
  attendance_rate: number | null;
  punctuality_rate: number | null;
  physical_expected: number;
  physical_attended: number;
  hours_worked: number;
  avg_clock_in: string | null; // "HH:MM" EAT
  reports_confirmed: number;
  reports_pending: number;
  meetings: MeetingAttendanceSummary;
}

export interface MyAttendance {
  start: string;
  end: string;
  days: AttendanceDay[];
  summary: AttendanceSummary;
}

export interface EmployeeBrief {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | null;
  role: string;
}

export interface AttendanceRegister {
  start: string;
  end: string;
  dates: string[];
  rows: { employee: EmployeeBrief; days: AttendanceDay[]; summary: AttendanceSummary }[];
}

export interface AttendanceTrendPoint {
  label: string;
  start: string;
  end: string;
  scheduled_days: number;
  attended: number;
  late: number;
  absent: number;
  attendance_rate: number | null;
}

export interface AttendanceReport {
  period: SummaryPeriod;
  label: string;
  start: string;
  end: string;
  bucket: TrendBucket;
  employee_count: number;
  meetings_held: number;
  totals: AttendanceSummary;
  trend: AttendanceTrendPoint[];
  rows: { employee: EmployeeBrief; summary: AttendanceSummary }[];
  highlights: {
    perfect_attendance: EmployeeBrief[];
    most_absences: { employee: EmployeeBrief; count: number }[];
    most_late: { employee: EmployeeBrief; count: number }[];
  };
  /** Day-by-day log; only present for single-employee statements. */
  days: AttendanceDay[] | null;
}

export interface AttendanceReportParams {
  period: SummaryPeriod;
  anchor?: string;
  start?: string;
  end?: string;
  user_id?: string;
}

export interface AttendanceAdjustmentInput {
  user_id: string;
  date: string;
  status: AdjustmentStatus;
  reason: string;
  clock_in_time?: string | null;
  clock_out_time?: string | null;
}

/** Inclusive date range as YYYY-MM-DD strings. */
export interface DateRange {
  start: string;
  end: string;
}

// --- Meetings ---

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  meeting_type: WorkMode;
  location_or_url: string | null;
  location_id: string | null;
  /** Resolved venue for in-person meetings (default location when none was chosen). */
  location: WorkLocation | null;
  start_time: string;
  end_time: string;
  status: MeetingStatus;
  audience: MeetingAudience;
  audience_roles: string[] | null;
  organizer_id: string;
  created_at: string;
}

export interface MyMeeting extends Meeting {
  my_status: MeetingRsvpStatus;
  my_attendance: MeetingAttendanceMark | null;
  checked_in_at: string | null;
  can_check_in: boolean;
}

export interface MeetingCounts {
  total: number;
  accepted: number;
  declined: number;
  attended: number;
  missed: number;
  excused: number;
}

export interface AdminMeeting extends Meeting {
  counts: MeetingCounts;
}

export interface MeetingAttendee extends EmployeeBrief {
  status: MeetingRsvpStatus;
  responded_at: string | null;
  attendance: MeetingAttendanceMark | null;
  checked_in_at: string | null;
  marked_by: string | null;
}

export interface MeetingDetail extends AdminMeeting {
  attendees: MeetingAttendee[];
}

export interface MeetingInput {
  title: string;
  description?: string;
  meeting_type: WorkMode;
  location_or_url?: string;
  /** Venue for in-person meetings; omit to use the default location. */
  location_id?: string | null;
  start_time: string;
  end_time: string;
  audience: MeetingAudience;
  audience_roles: string[];
  attendee_ids: string[];
}

/** Directory entry returned by GET /admin/employees. */
export interface Employee extends EmployeeBrief {
  permissions: string[];
  is_active: boolean;
  last_active_at: string | null;
}
