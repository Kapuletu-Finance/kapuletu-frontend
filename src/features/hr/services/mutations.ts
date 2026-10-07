import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

interface ClockInPayload {
  work_mode: "physical" | "remote";
  latitude: string | null;
  longitude: string | null;
}

export const useClockInMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ClockInPayload) => {
      const res = await apiClient.post("/hr/reports/clock-in", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "reports"] });
      toast.success("Clocked in successfully.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to clock in");
    },
  });
};

export const useClockOutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (work_summary: string) => {
      const res = await apiClient.post("/hr/reports/clock-out", { work_summary });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "reports"] });
      toast.success("Clocked out successfully.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to clock out");
    },
  });
};

export const useConfirmReportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reportId,
      status,
      notes,
    }: {
      reportId: string;
      status: "confirmed" | "rejected";
      notes?: string;
    }) => {
      const res = await apiClient.put(`/hr/reports/${reportId}/confirm`, null, {
        params: { status, notes },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "reports"] });
      toast.success("Report reviewed successfully.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to review report");
    },
  });
};

export const useScheduleMeetingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      title: string;
      description?: string;
      meeting_type: "online" | "physical";
      location_or_url?: string;
      start_time: string;
      end_time: string;
      attendee_ids: string[];
    }) => {
      const res = await apiClient.post("/hr/meetings", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "meetings"] });
      toast.success("Meeting scheduled successfully.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to schedule meeting");
    },
  });
};

export const useMarkAttendanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      meetingId,
      userId,
      attendance,
    }: {
      meetingId: string;
      userId: string;
      attendance: "attended" | "missed" | "excused";
    }) => {
      const res = await apiClient.put(`/hr/meetings/${meetingId}/attendance/${userId}`, null, {
        params: { attendance },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "meetings"] });
      toast.success("Attendance marked.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to mark attendance");
    },
  });
};

interface OfficeLocationPayload {
  location_name: string;
  latitude: string;
  longitude: string;
  radius_meters: string;
}

export const useUpdateOfficeLocationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: OfficeLocationPayload) => {
      const res = await apiClient.put("/hr/office-location", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "office-location"] });
      toast.success("Office location saved successfully.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to save office location.");
    },
  });
};
