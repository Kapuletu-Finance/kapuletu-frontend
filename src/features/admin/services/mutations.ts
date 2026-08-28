import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

// --- Types ---

export interface FeedbackSubmission {
  feedback_type: "bug" | "feature_request" | "ux_issue" | "performance" | "general";
  app_area: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  what_works?: string;
  what_needs_improvement?: string;
  steps_to_reproduce?: string;
  expected_behavior?: string;
  overall_rating?: number | null;
}

export interface FeedbackUpdate {
  status?: string;
  admin_response?: string;
}

// --- Mutations ---

export const useSubmitFeedbackMutation = () => {
  return useMutation({
    mutationFn: async (data: FeedbackSubmission) => {
      const response = await apiClient.post<{ feedback_id: string; message: string }>(
        "/feedback",
        data,
      );
      return response.data;
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit feedback. Please try again.",
      );
    },
  });
};

export const useUpdateFeedbackMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ feedbackId, data }: { feedbackId: string; data: FeedbackUpdate }) => {
      const response = await apiClient.patch<{ message: string }>(
        `/feedback/admin/${feedbackId}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Feedback updated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "feedback"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update feedback.");
    },
  });
};

export const useUpdateUserStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      status,
      reason,
    }: {
      userId: string;
      status: "active" | "suspended";
      reason?: string;
    }) => {
      const response = await apiClient.post<{ message: string }>(
        `/admin/users/treasurers/${userId}/status`,
        { status, reason },
      );
      return response.data;
    },
    onSuccess: (_, { userId }) => {
      toast.success("User status updated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", userId] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update user status.");
    },
  });
};

export const useEscalatedUpdateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: { first_name?: string; last_name?: string; email?: string; phone?: string };
    }) => {
      const response = await apiClient.patch<{ message: string }>(
        `/admin/users/treasurers/${userId}`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, { userId }) => {
      toast.success("User profile updated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", userId] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update user profile.");
    },
  });
};

export const useUpgradeUserRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await apiClient.patch<{ message: string }>(
        `/admin/users/treasurers/${userId}/role`,
        { role },
      );
      return response.data;
    },
    onSuccess: (_, { userId }) => {
      toast.success("User role upgraded.");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", userId] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to upgrade user role.");
    },
  });
};

export const useUpgradeUserPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      plan_id,
      duration,
      is_trial,
    }: {
      userId: string;
      plan_id: string;
      duration: number;
      is_trial?: boolean;
    }) => {
      const response = await apiClient.post<{ message: string }>(
        `/admin/users/treasurers/${userId}/plan`,
        { plan_id, duration, is_trial },
      );
      return response.data;
    },
    onSuccess: (_, { userId }) => {
      toast.success("User plan upgraded.");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", userId] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to upgrade user plan.");
    },
  });
};

export const useCreatePlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      price: number;
      max_groups?: number;
      max_campaigns?: number;
      max_transactions?: number;
      allowed_features?: string[];
    }) => {
      const response = await apiClient.post<{ message: string; id: string }>(
        "/admin/finance/plans",
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Subscription plan created.");
      queryClient.invalidateQueries({ queryKey: ["admin", "finance", "plans"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create plan.");
    },
  });
};

export const useUpdatePlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      planId,
      data,
    }: {
      planId: string;
      data: Partial<Record<string, unknown>>;
    }) => {
      const response = await apiClient.patch<{ message: string }>(
        `/admin/finance/plans/${planId}`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, { planId }) => {
      toast.success("Subscription plan updated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "finance", "plans"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "finance", "plans", planId] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update plan.");
    },
  });
};

export const useExportFinancialDataMutation = () => {
  return useMutation({
    mutationFn: async ({
      format,
      startDate,
      endDate,
    }: {
      format: "csv" | "excel" | "pdf";
      startDate?: string;
      endDate?: string;
    }) => {
      const params = new URLSearchParams({ format });
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const response = await apiClient.get(`/admin/finance/analytics/export?${params.toString()}`, {
        responseType: "blob",
      });
      return { data: response.data, format };
    },
    onSuccess: ({ data, format }) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;

      const extension = format === "excel" ? "xlsx" : format;
      const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
      link.setAttribute("download", `financial_export_${dateStr}.${extension}`);

      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Exported as ${format.toUpperCase()} successfully.`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to export data.");
    },
  });
};

export const useProcessRefundMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ paymentId, reason }: { paymentId: string; reason: string }) => {
      const response = await apiClient.post<{ message: string }>(
        `/admin/finance/payments/${paymentId}/refund`,
        { reason },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Refund processed successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin", "finance", "payments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-metrics"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to process refund.");
    },
  });
};

export const useManualOverrideMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      user_id: string;
      plan_id: string;
      duration?: number;
      is_trial?: boolean;
    }) => {
      const response = await apiClient.post<{ message: string }>(
        "/admin/finance/payments/override",
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("User subscription manually overridden.");
      queryClient.invalidateQueries({ queryKey: ["admin", "finance", "payments"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to override subscription.");
    },
  });
};

export const useSendBroadcastMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      message: string;
      channels: ("in_app" | "email" | "whatsapp")[];
      target_type: "all_members" | "active_subscribers" | "treasurers";
      target_ids?: string[];
    }) => {
      const response = await apiClient.post<{
        status: string;
        campaign_id: string;
        recipients: number;
      }>("/admin/crm/broadcast", data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "broadcasts"] });
      toast.success(`Broadcast queued! Sending to ${data.recipients} users.`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to send broadcast.");
    },
  });
};

export const useAdminUpdateTicketMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ticketId,
      payload,
    }: {
      ticketId: string;
      payload: Record<string, unknown>;
    }) => {
      const response = await apiClient.patch(`/admin/crm/tickets/${ticketId}`, payload);
      return response.data;
    },
    onSuccess: (_, v) => {
      toast.success("Ticket updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin", "support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "support-tickets", v.ticketId] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update ticket.");
    },
  });
};

export const useAdminReplyTicketMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ticketId,
      payload,
    }: {
      ticketId: string;
      payload: Record<string, unknown>;
    }) => {
      const response = await apiClient.post(`/admin/crm/tickets/${ticketId}/reply`, payload);
      return response.data;
    },
    onSuccess: (_, v) => {
      toast.success("Reply sent via Email to the Treasurer.");
      queryClient.invalidateQueries({ queryKey: ["admin", "support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "support-tickets", v.ticketId] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to send reply.");
    },
  });
};

// --- AI Governance Mutations ---

export const useApproveFeedbackMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ feedbackId, approve }: { feedbackId: string; approve: boolean }) => {
      const response = await apiClient.post(`/admin/ai/parser/feedback-queue/${feedbackId}`, {
        approve,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Feedback reviewed successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin", "ai", "feedback-queue"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "ai", "training-data"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to review feedback.");
    },
  });
};

export const useInjectTrainingSampleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { text: string; ground_truth: Record<string, unknown> }) => {
      const response = await apiClient.post("/admin/ai/parser/training-data", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Training sample added successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin", "ai", "training-data"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to add training sample.");
    },
  });
};

export const useTriggerAITrainingMutation = () => {
  return useMutation({
    mutationFn: async (payload: { epochs: number }) => {
      const response = await apiClient.post("/admin/ai/parser/train", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("AI retraining triggered successfully.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to trigger AI retraining.");
    },
  });
};

export const useUpdateAIConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await apiClient.post("/admin/ai/parser/config", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("AI configuration updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin", "ai", "config"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update config.");
    },
  });
};

export const useVerifyAdminPinMutation = () => {
  return useMutation({
    mutationFn: async (payload: { pin: string }) => {
      const response = await apiClient.post("/admin/auth/verify-pin", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Access unlocked.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Invalid PIN.");
    },
  });
};

export const useTriggerPasswordResetMutation = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.post(`/admin/users/treasurers/${userId}/reset-password`, {});
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password reset instructions sent.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to trigger password reset.");
    },
  });
};

export const useSetAdminPinMutation = () => {
  return useMutation({
    mutationFn: async (payload: { pin: string }) => {
      const response = await apiClient.post("/admin/auth/set-pin", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Admin PIN updated successfully.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update Admin PIN.");
    },
  });
};

// --- System Config ---

export const useUpdateSystemConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (configs: { key: string; value: any }[]) => {
      const response = await apiClient.patch<{ message: string }>("/admin/config", {
        configs,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Platform configurations updated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "system-config"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update platform configurations.",
      );
    },
  });
};
