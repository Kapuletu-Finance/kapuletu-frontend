import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// --- Types ---

export interface AdminFeedbackItem {
  feedback_id: string;
  user_id: string;
  user_name: string;
  feedback_type: "bug" | "feature_request" | "ux_issue" | "performance" | "general";
  app_area: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  what_works: string | null;
  what_needs_improvement: string | null;
  steps_to_reproduce: string | null;
  expected_behavior: string | null;
  overall_rating: number | null;
  status: "new" | "reviewing" | "planned" | "in_progress" | "shipped" | "declined";
  admin_response: string | null;
  created_at: string;
}

export interface AdminFeedbackResponse {
  items: AdminFeedbackItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AdminFeedbackFilters {
  feedback_type?: string;
  app_area?: string;
  severity?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// --- Queries ---

export const useAdminFeedbackQuery = (filters: AdminFeedbackFilters = {}) => {
  return useQuery({
    queryKey: ["admin", "feedback", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.feedback_type) params.set("feedback_type", filters.feedback_type);
      if (filters.app_area) params.set("app_area", filters.app_area);
      if (filters.severity) params.set("severity", filters.severity);
      if (filters.status) params.set("status", filters.status);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));
      const response = await apiClient.get<AdminFeedbackResponse>(
        `/feedback/admin?${params.toString()}`,
      );
      return response.data;
    },
  });
};

export interface AdminOverviewResponse {
  kpis: {
    total_treasurers: number;
    active_treasurers: number;
    total_revenue_kes: number;
    active_subscriptions: number;
    pending_tickets: number;
    ai_accuracy_rate: number;
    total_feedback: number;
    new_feedback: number;
  };
  revenue_trend: {
    date: string;
    amount: number;
  }[];
  recent_signups: {
    user_id: string;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
  }[];
  recent_payments: {
    payment_id: string;
    user_name: string;
    plan_name: string;
    amount: number;
    currency: string;
    method: string;
    status: string;
    created_at: string;
  }[];
  recent_groups: {
    group_id: string;
    group_name: string;
    owner_name: string;
    status: string;
    created_at: string;
  }[];
  subscription_breakdown: {
    plan: string;
    count: number;
  }[];
  feedback_summary: {
    new: number;
    reviewing: number;
    planned: number;
    in_progress: number;
    shipped: number;
    declined: number;
  };
}

export const useAdminOverviewQuery = () => {
  return useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const response = await apiClient.get<AdminOverviewResponse>("/admin/overview");
      return response.data;
    },
  });
};
