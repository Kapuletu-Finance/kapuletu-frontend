import { type QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { hrKeys } from "@/features/hr/services/queries";
import type {
  AttendanceAdjustmentInput,
  AttendanceReportParams,
  Coordinates,
  MeetingAttendanceMark,
  MeetingDetail,
  MeetingInput,
  ScheduleDay,
  ScheduleOverrideInput,
  WorkLocation,
  WorkLocationInput,
} from "@/features/hr/types";
import { HR_URLS } from "@/features/hr/urls";
import { getCurrentCoordinates } from "@/features/hr/utils";
import { apiClient } from "@/lib/api-client";
import { downloadFile } from "@/lib/download";

/**
 * Shared mutation wiring for the HR module: toast on success/failure and invalidate the
 * affected query groups. Error messages come from the API (normalised by apiClient).
 */
const useHrMutation = <TVariables, TData = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  { success, invalidate }: { success: string | ((data: TData) => string); invalidate: QueryKey[] },
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      for (const queryKey of invalidate) queryClient.invalidateQueries({ queryKey });
      toast.success(typeof success === "function" ? success(data) : success);
    },
  });
};

/** Coordinates are only collected when the action needs to prove office presence. */
const coordinatesIf = async (needed: boolean): Promise<Partial<Coordinates>> =>
  needed ? getCurrentCoordinates() : {};

// --- Daily attendance ---

export const useClockInMutation = () =>
  useHrMutation(
    async ({ requiresLocation }: { requiresLocation: boolean }) =>
      (await apiClient.post(HR_URLS.clockIn, await coordinatesIf(requiresLocation))).data,
    { invalidate: [hrKeys.attendance, hrKeys.reportsAll], success: "Clocked in successfully." },
  );

export const useClockOutMutation = () =>
  useHrMutation(
    async (work_summary: string) => (await apiClient.post(HR_URLS.clockOut, { work_summary })).data,
    { invalidate: [hrKeys.attendance, hrKeys.reportsAll], success: "Clocked out successfully." },
  );

export const useConfirmReportMutation = () =>
  useHrMutation(
    async ({
      reportId,
      status,
      notes,
    }: {
      reportId: string;
      status: "confirmed" | "rejected";
      notes?: string;
    }) =>
      (await apiClient.put(HR_URLS.confirmReport(reportId), null, { params: { notes, status } }))
        .data,
    { invalidate: [hrKeys.reportsAll], success: "Report reviewed successfully." },
  );

export const useDownloadAttendanceReportMutation = () =>
  useHrMutation(
    (params: AttendanceReportParams) =>
      downloadFile(HR_URLS.attendanceSummaryPdf, {
        fallbackName: `attendance-report-${params.period}.pdf`,
        params,
      }),
    { invalidate: [], success: (filename) => `Official document downloaded: ${filename}` },
  );

// --- Schedule ---

export const useUpdateCompanyScheduleMutation = () =>
  useHrMutation(
    async (days: ScheduleDay[]) => (await apiClient.put(HR_URLS.schedule, { days })).data,
    { invalidate: [hrKeys.schedule, hrKeys.attendance], success: "Company schedule saved." },
  );

export const useUpdateEmployeeScheduleMutation = () =>
  useHrMutation(
    async ({ userId, days }: { userId: string; days: ScheduleDay[] }) =>
      (await apiClient.put(HR_URLS.employeeSchedule(userId), { days })).data,
    { invalidate: [hrKeys.schedule, hrKeys.attendance], success: "Employee schedule saved." },
  );

export const useUpsertOverrideMutation = () =>
  useHrMutation(
    async (payload: ScheduleOverrideInput) =>
      (await apiClient.post(HR_URLS.scheduleOverrides, payload)).data,
    { invalidate: [hrKeys.schedule, hrKeys.attendance], success: "Date override saved." },
  );

export const useDeleteOverrideMutation = () =>
  useHrMutation(
    async (overrideId: string) =>
      (await apiClient.delete(HR_URLS.scheduleOverride(overrideId))).data,
    { invalidate: [hrKeys.schedule, hrKeys.attendance], success: "Date override removed." },
  );

// --- Meetings (admin) ---

export const useScheduleMeetingMutation = () =>
  useHrMutation(
    async (payload: MeetingInput) => (await apiClient.post(HR_URLS.meetings, payload)).data,
    {
      invalidate: [hrKeys.meetings],
      success: "Meeting scheduled. Attendees have been notified.",
    },
  );

export const useUpdateMeetingMutation = () =>
  useHrMutation(
    async ({ meetingId, payload }: { meetingId: string; payload: Partial<MeetingInput> }) =>
      (await apiClient.patch(HR_URLS.meeting(meetingId), payload)).data,
    {
      invalidate: [hrKeys.meetings],
      success: "Meeting updated. Affected attendees have been notified.",
    },
  );

export const useCancelMeetingMutation = () =>
  useHrMutation(
    async (meetingId: string) => (await apiClient.post(HR_URLS.meetingCancel(meetingId))).data,
    { invalidate: [hrKeys.meetings], success: "Meeting cancelled. Attendees have been notified." },
  );

export const useMarkAttendanceMutation = () =>
  useHrMutation(
    async ({
      meetingId,
      records,
    }: {
      meetingId: string;
      records: { user_id: string; attendance: MeetingAttendanceMark }[];
    }) =>
      (await apiClient.put<MeetingDetail>(HR_URLS.meetingAttendance(meetingId), { records })).data,
    {
      invalidate: [hrKeys.meetings, hrKeys.attendance],
      success: (detail) => `Attendance saved for "${detail.title}".`,
    },
  );

// --- Meetings (attendee) ---

export const useRsvpMutation = () =>
  useHrMutation(
    async ({ meetingId, response }: { meetingId: string; response: "accepted" | "declined" }) =>
      (await apiClient.post(HR_URLS.meetingRsvp(meetingId), { response })).data,
    { invalidate: [hrKeys.myMeetings], success: "Your response has been recorded." },
  );

export const useMeetingCheckInMutation = () =>
  useHrMutation(
    async ({ meetingId, requiresLocation }: { meetingId: string; requiresLocation: boolean }) =>
      (
        await apiClient.post(
          HR_URLS.meetingCheckIn(meetingId),
          await coordinatesIf(requiresLocation),
        )
      ).data,
    { invalidate: [hrKeys.myMeetings, hrKeys.attendance], success: "You're checked in." },
  );

// --- Work locations ---

export const useSaveWorkLocationMutation = () =>
  useHrMutation(
    async ({ id, payload }: { id?: string; payload: WorkLocationInput }) =>
      (id
        ? await apiClient.put<WorkLocation>(HR_URLS.location(id), payload)
        : await apiClient.post<WorkLocation>(HR_URLS.locations, payload)
      ).data,
    {
      // Locations change where clock-ins and meetings are checked.
      invalidate: [hrKeys.locations, hrKeys.attendance, hrKeys.meetings],
      success: (location) => `${location.name} saved.`,
    },
  );

export const useWorkLocationActionMutation = () =>
  useHrMutation(
    async ({ id, action }: { id: string; action: "default" | "archive" | "restore" }) => {
      const url = {
        archive: HR_URLS.locationArchive,
        default: HR_URLS.locationDefault,
        restore: HR_URLS.locationRestore,
      }[action](id);
      return (await apiClient.post<WorkLocation>(url)).data;
    },
    {
      invalidate: [hrKeys.locations, hrKeys.attendance, hrKeys.meetings],
      success: (location) =>
        location.is_default
          ? `${location.name} is now the default location.`
          : `${location.name} ${location.is_active ? "restored" : "archived"}.`,
    },
  );

// --- Attendance corrections ---

export const useSaveAdjustmentMutation = () =>
  useHrMutation(
    async (payload: AttendanceAdjustmentInput) =>
      (await apiClient.put(HR_URLS.attendanceAdjustments, payload)).data,
    {
      invalidate: [hrKeys.attendance],
      success: "Attendance corrected. The employee has been notified.",
    },
  );

export const useRevertAdjustmentMutation = () =>
  useHrMutation(
    async ({ userId, date }: { userId: string; date: string }) =>
      (await apiClient.delete(HR_URLS.attendanceAdjustment(userId, date))).data,
    {
      invalidate: [hrKeys.attendance],
      success: "Correction removed; recorded attendance applies again.",
    },
  );
