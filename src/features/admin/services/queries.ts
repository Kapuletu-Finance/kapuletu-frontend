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
      const { data } = await apiClient.get<AdminFeedbackItem>(`/feedback/admin/${feedbackId}`);
      return data;
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
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      const res = await apiClient.get("/admin/overview");
      return res.data;
    },
  });
};

export const useAdminSupportTicketsQuery = (status: string = "open") => {
  return useQuery({
    queryKey: ["admin", "support-tickets", status],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/crm/tickets?status=${status}`);
      return response.data;
    },
  });
};

export const useAdminTicketDetailQuery = (ticketId: string | null) => {
  return useQuery({
    queryKey: ["admin", "support-tickets", ticketId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/crm/tickets/${ticketId}`);
      return response.data;
    },
    enabled: !!ticketId,
    refetchInterval: 5000,
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
  role?: string;
  is_active: boolean;
  plan_name: string;
  created_at: string;
}

export interface AdminUsersResponse {
  total: number;
  page: number;
  limit: number;
  kpis: {
    total: number;
    active: number;
    suspended: number;
    new_this_month: number;
  };
  users: AdminUserItem[];
}

export interface AdminUsersFilters {
  status?: string;
  role?: string;
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
    plan_name?: string;
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
  campaigns: {
    campaign_id: string;
    name: string;
    target_amount: number;
    status: string;
  }[];
}

export interface AdminFinancePlanItem {
  plan_id: string;
  name: string;
  description?: string;
  price: number;
  billing_cycle?: string;
  is_active?: boolean;
  features?: string[];
  max_groups: number;
  max_campaigns: number;
  max_transactions: number;
  allowed_features?: string[];
}

export const useAdminUsersQuery = (filters: AdminUsersFilters = {}) => {
  return useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.role) params.set("role", filters.role);
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

export const useAdminPlanQuery = (planId: string) => {
  return useQuery({
    queryKey: ["admin", "finance", "plans", planId],
    queryFn: async () => {
      const response = await apiClient.get<AdminFinancePlanItem>(`/admin/finance/plans/${planId}`);
      return response.data;
    },
    enabled: !!planId,
  });
};

export interface AdminFinancialHealthResponse {
  mrr: number;
  active_subscribers: number;
  churn_rate_percent: number;
  generated_at: string;
}

export const useAdminFinancialHealthQuery = () => {
  return useQuery({
    queryKey: ["admin", "finance", "analytics", "health"],
    queryFn: async () => {
      const response = await apiClient.get<AdminFinancialHealthResponse>(
        "/admin/finance/analytics/health-metrics",
      );
      return response.data;
    },
  });
};

export interface AdminRevenueFlowItem {
  period: string;
  [planName: string]: string | number; // e.g. "Basic": 500
}

export const useAdminRevenueFlowQuery = (interval: "week" | "month" = "month") => {
  return useQuery({
    queryKey: ["admin", "finance", "analytics", "revenue-flow", interval],
    queryFn: async () => {
      const response = await apiClient.get<AdminRevenueFlowItem[]>(
        `/admin/finance/analytics/revenue-flow?interval=${interval}`,
      );
      return response.data;
    },
  });
};

export interface AdminCohortItem {
  cohort: string;
  users: number;
  retention: number[];
}

export const useAdminCohortsQuery = () => {
  return useQuery({
    queryKey: ["admin", "finance", "analytics", "cohorts"],
    queryFn: async () => {
      const response = await apiClient.get<AdminCohortItem[]>("/admin/finance/analytics/cohorts");
      return response.data;
    },
  });
};

export interface AdminUserActivityItem {
  log_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  timestamp: string;
}

export const useAdminUserActivityQuery = (userId: string) => {
  return useQuery({
    queryKey: ["admin", "users", userId, "activity"],
    queryFn: async () => {
      const response = await apiClient.get<AdminUserActivityItem[]>(
        `/admin/users/treasurers/${userId}/activity`,
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

export interface AdminFinancePaymentItem {
  payment_id: string;
  user_id: string;
  user_name: string;
  plan_name: string;
  amount: number;
  status: string;
  method: string;
  created_at: string;
}

export interface AdminFinancePaymentsResponse {
  items: AdminFinancePaymentItem[];
  total: number;
  page: number;
  limit: number;
}

export const useAdminFinancePaymentsQuery = (page: number = 1, limit: number = 50) => {
  return useQuery({
    queryKey: ["admin", "finance", "payments", page, limit],
    queryFn: async () => {
      const response = await apiClient.get<AdminFinancePaymentsResponse>(
        `/admin/finance/payments?page=${page}&limit=${limit}`,
      );
      return response.data;
    },
  });
};

// --- AI Governance ---

export interface AIFeedbackItem {
  feedback_id: string;
  user_id: string;
  original: Record<string, unknown>;
  corrected: Record<string, unknown>;
  created_at: string;
}

export const useAIFeedbackQueueQuery = () => {
  return useQuery({
    queryKey: ["admin", "ai", "feedback-queue"],
    queryFn: async () => {
      const response = await apiClient.get<AIFeedbackItem[]>("/admin/ai/parser/feedback-queue");
      return response.data;
    },
  });
};

export interface AITrainingSample {
  id: string;
  text: string;
  ground_truth: Record<string, unknown>;
  source: string;
}

export const useAITrainingPoolQuery = () => {
  return useQuery({
    queryKey: ["admin", "ai", "training-data"],
    queryFn: async () => {
      const response = await apiClient.get<AITrainingSample[]>("/admin/ai/parser/training-data");
      return response.data;
    },
  });
};

export interface AIConfig {
  training_mode: string;
  continuous_threshold: number;
}

export const useAIConfigQuery = () => {
  return useQuery({
    queryKey: ["admin", "ai", "config"],
    queryFn: async () => {
      const response = await apiClient.get<AIConfig>("/admin/ai/parser/config");
      return response.data;
    },
  });
};

export interface ActiveUser {
  user_id: string;
  slug: string;
  full_name: string;
  email: string;
  role: string;
  last_active_at: string;
}

export interface ActivityResponse {
  active_now: ActiveUser[];
  recent: ActiveUser[];
  kpis: {
    active_now_count: number;
    recent_count: number;
  };
}

export const useAdminActiveUsersQuery = () => {
  return useQuery({
    queryKey: ["admin", "users", "activity"],
    queryFn: async () => {
      const response = await apiClient.get<ActivityResponse>("/admin/users/activity");
      return response.data;
    },
    refetchInterval: 15000, // Refetch every 15 seconds
  });
};

// --- Performance ---

export interface SystemHealthKPIs {
  uptime_percent: number;
  avg_response_time_ms: number;
  cpu_load_percent: number;
  error_rate_percent: number;
  active_connections: number;
}

export const usePerformanceMetricsQuery = () => {
  return useQuery({
    queryKey: ["admin", "performance", "health"],
    queryFn: async () => {
      const response = await apiClient.get<SystemHealthKPIs>("/admin/performance/health");
      return response.data;
    },
    refetchInterval: 15000,
  });
};

export interface PerformanceActivityTrend {
  time: string;
  active_sessions: number;
  api_requests: number;
}

export const usePerformanceActivityQuery = () => {
  return useQuery({
    queryKey: ["admin", "performance", "activity-trend"],
    queryFn: async () => {
      const response = await apiClient.get<PerformanceActivityTrend[]>(
        "/admin/performance/activity-trend",
      );
      return response.data;
    },
    refetchInterval: 60000,
  });
};

export interface ExtendedActiveUser {
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  last_active_at: string | null;
  current_action: string;
}

export interface ExtendedActiveUsersResponse {
  active_now: ExtendedActiveUser[];
  active_now_count: number;
  recent_24h_count: number;
  total_active_24h: number;
}

export const useExtendedActiveUsersQuery = () => {
  return useQuery({
    queryKey: ["admin", "performance", "active-users"],
    queryFn: async () => {
      const response = await apiClient.get<ExtendedActiveUsersResponse>(
        "/admin/performance/active-users",
      );
      return response.data;
    },
    refetchInterval: 15000,
  });
};

export interface SystemEvent {
  id: string;
  type: "error" | "info" | "warning";
  message: string;
  timestamp: string;
  source: string;
}

export const usePerformanceEventsQuery = () => {
  return useQuery({
    queryKey: ["admin", "performance", "events"],
    queryFn: async () => {
      const response = await apiClient.get<SystemEvent[]>("/admin/performance/events");
      return response.data;
    },
    refetchInterval: 15000,
  });
};

// --- System Config ---

export interface SystemConfigResponse {
  [key: string]: any;
}

export const useSystemConfigQuery = () => {
  return useQuery({
    queryKey: ["admin", "system-config"],
    queryFn: async () => {
      const response = await apiClient.get<SystemConfigResponse>("/admin/config");
      return response.data;
    },
  });
};
export interface AdminBroadcastItem {
  id: string;
  title: string;
  target_audience: string;
  channels: string[];
  status: string;
  recipients_count: number;
  created_at: string;
}

export const useAdminBroadcastsQuery = () => {
  return useQuery({
    queryKey: ["admin", "broadcasts"],
    queryFn: async () => {
      const response = await apiClient.get<AdminBroadcastItem[]>("/admin/crm/broadcasts");
      return response.data;
    },
  });
};
