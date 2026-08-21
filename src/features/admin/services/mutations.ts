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
