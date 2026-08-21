import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// --- Types ---

export interface AdminFeedbackItem {
  feedback_id: string;
  reference_number: string;
  user_id: string;
  user_name: string;
  user_email?: string;
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

export interface AdminFeedbackDetailsResponse {
  message: string;
  data: AdminFeedbackItem;
}

export const useAdminFeedbackDetailsQuery = (feedbackId: string) => {
  return useQuery({
    queryKey: ["admin", "feedback", feedbackId],
    queryFn: async () => {
      const { data } = await apiClient.get<AdminFeedbackDetailsResponse>(
        `/admin/feedback/${feedbackId}`,
      );
      return data.data;
    },
    enabled: !!feedbackId,
  });
};

// --- Audit Logs ---

export interface AuditLogItem {
  log_id: string;
  actor_id: string | null;
  actor_name: string;
  actor_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  timestamp: string;
}

export interface AuditLogsResponse {
  total: number;
  page: number;
  logs: AuditLogItem[];
}

export interface AuditLogFilters {
  actor_id?: string;
  entity_type?: string;
  action?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export const useAuditLogsQuery = (filters: AuditLogFilters) => {
  return useQuery({
    queryKey: ["admin", "audit", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.actor_id) params.set("actor_id", filters.actor_id);
      if (filters.entity_type) params.set("entity_type", filters.entity_type);
      if (filters.action) params.set("action", filters.action);
      if (filters.q) params.set("q", filters.q);
      if (filters.page) params.set("page", filters.page.toString());
      if (filters.limit) params.set("limit", filters.limit.toString());

      const { data } = await apiClient.get<AuditLogsResponse>(
        `/admin/audit/logs?${params.toString()}`,
      );
      return data;
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

export const useNewFeedbackCountQuery = () => {
  return useQuery({
    queryKey: ["admin", "feedback", "count", "new"],
    queryFn: async () => {
      // Just fetch 1 item to get the total count of 'new' feedback
      const response = await apiClient.get<{ total: number }>("/feedback/admin?status=new&limit=1");
      return response.data.total;
    },
    // Refetch periodically to keep the badge updated
    refetchInterval: 60000,
  });
};

export interface AdminUserItem {
  user_id: string;
  slug: string;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
}

export interface AdminUsersResponse {
  total: number;
  page: number;
  limit: number;
  users: AdminUserItem[];
}

export interface AdminUsersFilters {
  status?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface AdminUserDetailsResponse {
  profile: {
    user_id: string;
    slug: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    is_active: boolean;
    created_at: string;
  };
  stats: {
    total_groups: number;
  };
}

export interface AdminUserGroupItem {
  group_id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface AdminFinancePlanItem {
  plan_id: string;
  name: string;
  description: string;
  price: number;
  billing_cycle: string;
  is_active: boolean;
  features: string[];
}

export const useAdminUsersQuery = (filters: AdminUsersFilters = {}) => {
  return useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.q) params.set("q", filters.q);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));

      const response = await apiClient.get<AdminUsersResponse>(
        `/admin/users/treasurers?${params.toString()}`,
      );
      return response.data;
    },
  });
};

export const useAdminUserDetailsQuery = (userId: string) => {
  return useQuery({
    queryKey: ["admin", "users", userId],
    queryFn: async () => {
      const response = await apiClient.get<AdminUserDetailsResponse>(
        `/admin/users/treasurers/${userId}`,
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useAdminUserGroupsQuery = (userId: string) => {
  return useQuery({
    queryKey: ["admin", "users", userId, "groups"],
    queryFn: async () => {
      const response = await apiClient.get<AdminUserGroupItem[]>(
        `/admin/users/treasurers/${userId}/groups`,
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useAdminFinancePlansQuery = () => {
  return useQuery({
    queryKey: ["admin", "finance", "plans"],
    queryFn: async () => {
      const response = await apiClient.get<AdminFinancePlanItem[]>("/admin/finance/plans");
      return response.data;
    },
  });
};
