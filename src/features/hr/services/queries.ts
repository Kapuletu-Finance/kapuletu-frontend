import { useQuery } from "@tanstack/react-query";
import type {
  AdminMeeting,
  AttendanceRegister,
  AttendanceReport,
  AttendanceReportParams,
  DateRange,
  EmployeeReport,
  EmployeeSchedule,
  MeetingDetail,
  MyAttendance,
  MyMeeting,
  ScheduleDay,
  ScheduleOverride,
  TodayStatus,
  WorkLocation,
} from "@/features/hr/types";
import { HR_URLS } from "@/features/hr/urls";
import { apiClient } from "@/lib/api-client";

export const hrKeys = {
  all: ["hr"] as const,
  allMeetings: ["hr", "meetings", "all"] as const,
  attendance: ["hr", "attendance"] as const,
  companySchedule: ["hr", "schedule", "company"] as const,
  employeeMeetings: (userId: string) => ["hr", "meetings", "employee", userId] as const,
  employeeSchedule: (userId: string) => ["hr", "schedule", "employee", userId] as const,
  meeting: (meetingId: string) => ["hr", "meetings", "detail", meetingId] as const,
  meetings: ["hr", "meetings"] as const,
  myAttendance: (range: DateRange) => ["hr", "attendance", "me", range] as const,
  myMeetings: ["hr", "meetings", "mine"] as const,
  locations: ["hr", "locations"] as const,
  overrides: (range: DateRange) => ["hr", "schedule", "overrides", range] as const,
  register: (range: DateRange) => ["hr", "attendance", "register", range] as const,
  report: (params: AttendanceReportParams) => ["hr", "attendance", "report", params] as const,
  reports: (userId?: string) => ["hr", "reports", userId] as const,
  reportsAll: ["hr", "reports"] as const,
  schedule: ["hr", "schedule"] as const,
  today: ["hr", "attendance", "today"] as const,
};

const get = async <T>(url: string, params?: object) =>
  (await apiClient.get<T>(url, { params })).data;

// --- Daily attendance ---

export const useEmployeeReportsQuery = (userId?: string) =>
  useQuery({
    enabled: !!userId,
    queryFn: () => get<EmployeeReport[]>(HR_URLS.employeeReports(userId as string)),
    queryKey: hrKeys.reports(userId),
  });

export const useTodayStatusQuery = () =>
  useQuery({
    queryFn: () => get<TodayStatus>(HR_URLS.attendanceToday),
    queryKey: hrKeys.today,
    // Keep the clock-in state fresh if the tab stays open across the cut-off time.
    refetchInterval: 5 * 60 * 1000,
  });

export const useMyAttendanceQuery = (range: DateRange) =>
  useQuery({
    queryFn: () => get<MyAttendance>(HR_URLS.attendanceMe, range),
    queryKey: hrKeys.myAttendance(range),
  });

export const useAttendanceRegisterQuery = (range: DateRange) =>
  useQuery({
    queryFn: () => get<AttendanceRegister>(HR_URLS.attendanceRegister, range),
    queryKey: hrKeys.register(range),
  });

export const useAttendanceReportQuery = (params: AttendanceReportParams, enabled = true) =>
  useQuery({
    enabled,
    queryFn: () => get<AttendanceReport>(HR_URLS.attendanceSummary, params),
    queryKey: hrKeys.report(params),
  });

// --- Schedule ---

export const useCompanyScheduleQuery = () =>
  useQuery({
    queryFn: () => get<ScheduleDay[]>(HR_URLS.schedule),
    queryKey: hrKeys.companySchedule,
  });

export const useEmployeeScheduleQuery = (userId?: string) =>
  useQuery({
    enabled: !!userId,
    queryFn: () => get<EmployeeSchedule>(HR_URLS.employeeSchedule(userId as string)),
    queryKey: hrKeys.employeeSchedule(userId ?? ""),
  });

export const useScheduleOverridesQuery = (range: DateRange) =>
  useQuery({
    queryFn: () => get<ScheduleOverride[]>(HR_URLS.scheduleOverrides, range),
    queryKey: hrKeys.overrides(range),
  });

// --- Meetings ---

export const useMyMeetingsQuery = () =>
  useQuery({
    queryFn: () => get<MyMeeting[]>(HR_URLS.meetings),
    queryKey: hrKeys.myMeetings,
    // Check-in availability depends on the clock; refresh it periodically.
    refetchInterval: 60 * 1000,
  });

/** One employee's invitations, responses and attendance (admin view). */
export const useEmployeeMeetingsQuery = (userId: string) =>
  useQuery({
    queryFn: () => get<MyMeeting[]>(HR_URLS.employeeMeetings(userId)),
    queryKey: hrKeys.employeeMeetings(userId),
  });

export const useAllMeetingsQuery = () =>
  useQuery({
    queryFn: () => get<AdminMeeting[]>(HR_URLS.meetingsAll),
    queryKey: hrKeys.allMeetings,
  });

export const useMeetingDetailQuery = (meetingId?: string) =>
  useQuery({
    enabled: !!meetingId,
    queryFn: () => get<MeetingDetail>(HR_URLS.meeting(meetingId as string)),
    queryKey: hrKeys.meeting(meetingId ?? ""),
  });

// --- Work locations ---

export const useWorkLocationsQuery = () =>
  useQuery({
    queryFn: () => get<WorkLocation[]>(HR_URLS.locations),
    queryKey: hrKeys.locations,
  });
