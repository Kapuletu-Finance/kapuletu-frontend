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
    }: {
      userId: string;
      plan_id: string;
      duration: number;
    }) => {
      const response = await apiClient.post<{ message: string }>(
        `/admin/users/treasurers/${userId}/plan`,
        { plan_id, duration },
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

export const useManualOverrideMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { user_id: string; plan_id: string; duration?: number }) => {
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
