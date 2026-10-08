/**
 * Hooks for the admin finance API (/admin/finance/*). Every route needs the manage_finance permission.
 */
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

// --- shared ---

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

type Params = Record<string, string | number | undefined | null>;

export const toQuery = (params: Params) => {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") q.set(key, String(value));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
};

export const errorMessage = (error: unknown, fallback: string) =>
  (error as any)?.response?.data?.detail || (error instanceof Error ? error.message : fallback);

export const FINANCE_KEY = ["admin", "finance"] as const;

// --- overview ---

export interface MetricValue {
  current: number;
  previous: number;
  change_pct: number | null;
}

export type MetricKey =
  | "mrr"
  | "arr"
  | "paying_customers"
  | "arpu"
  | "new_paying_customers"
  | "churned_customers"
  | "churn_rate_percent"
  | "net_revenue"
  | "gross_revenue"
  | "refunds"
  | "cash_collected"
  | "failed_payments"
  | "failed_payment_rate_percent"
  | "trials_started"
  | "trial_conversion_rate_percent"
  | "comps_granted";

export type SubscriptionState = "paid" | "trial" | "comp" | "lapsed" | "free";

export interface FinanceOverview {
  period: { from: string; to: string };
  previous_period: { from: string; to: string };
  metrics: Record<MetricKey, MetricValue>;
  subscriptions: Record<SubscriptionState, number>;
  generated_at: string;
}

export const useFinanceOverviewQuery = (from?: string, to?: string) =>
  useQuery({
    queryKey: [...FINANCE_KEY, "overview", from, to],
    queryFn: async () =>
      (await apiClient.get<FinanceOverview>(`/admin/finance/overview${toQuery({ from, to })}`))
        .data,
    placeholderData: keepPreviousData,
  });

export interface MrrPoint {
  date: string;
  mrr: number;
  paying_customers: number;
}

export const useMrrSeriesQuery = (months = 12) =>
  useQuery({
    queryKey: [...FINANCE_KEY, "mrr-series", months],
    queryFn: async () =>
      (await apiClient.get<MrrPoint[]>(`/admin/finance/analytics/mrr-series?months=${months}`))
        .data,
  });

// --- subscriptions ---

export interface FinanceSubscription {
  subscription_id: string;
  user_id: string;
  user_name: string;
  user_email: string | null;
  user_slug: string | null;
  plan_id: string | null;
  plan_code: string | null;
  plan_name: string | null;
  state: SubscriptionState;
  status: string;
  is_trial: boolean;
  is_auto_renew: boolean;
  start_date: string | null;
  end_date: string | null;
  days_remaining: number | null;
}

export interface SubscriptionFilters {
  state?: SubscriptionState | "";
  plan_id?: string;
  renews_before?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export const useFinanceSubscriptionsQuery = (filters: SubscriptionFilters) =>
  useQuery({
    queryKey: [...FINANCE_KEY, "subscriptions", filters],
    queryFn: async () =>
      (
        await apiClient.get<Paged<FinanceSubscription>>(
          `/admin/finance/subscriptions${toQuery({ ...filters })}`,
        )
      ).data,
    placeholderData: keepPreviousData,
  });

export const useSubscriptionSummaryQuery = () =>
  useQuery({
    queryKey: [...FINANCE_KEY, "subscriptions", "summary"],
    queryFn: async () =>
      (
        await apiClient.get<Record<SubscriptionState, number>>(
          "/admin/finance/subscriptions/summary",
        )
      ).data,
  });

export type SubscriptionAction =
  | { action: "extend"; days: number; reason: string }
  | { action: "change_plan"; plan_id: string; reason: string }
  | { action: "cancel"; reason: string };

export const useSubscriptionActionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subscriptionId,
      ...body
    }: { subscriptionId: string } & SubscriptionAction) =>
      (
        await apiClient.post<FinanceSubscription>(
          `/admin/finance/subscriptions/${subscriptionId}/actions`,
          body,
        )
      ).data,
    onSuccess: (_, vars) => {
      const done = {
        extend: "Subscription extended.",
        change_plan: "Plan changed.",
        cancel: "Subscription cancelled.",
      };
      toast.success(done[vars.action]);
      queryClient.invalidateQueries({ queryKey: FINANCE_KEY });
    },
    onError: (error) => toast.error(errorMessage(error, "Action failed.")),
  });
};

export const useGrantPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      user_id: string;
      plan_id: string;
      duration: number;
      is_trial: boolean;
      reason: string;
    }) => (await apiClient.post("/admin/finance/payments/override", body)).data,
    onSuccess: () => {
      toast.success("Plan granted.");
      queryClient.invalidateQueries({ queryKey: FINANCE_KEY });
    },
    onError: (error) => toast.error(errorMessage(error, "Could not grant the plan.")),
  });
};

// --- payments & invoices ---

export interface FinancePayment {
  payment_id: string;
  user_id: string;
  user_name: string | null;
  plan_name: string | null;
  amount: number;
  currency: string;
  status: string;
  method: string | null;
  transaction_type: "payment" | "refund" | "comp";
  invoice_number: string | null;
  receipt_number: string | null;
  provider_reference: string | null;
  failure_reason: string | null;
  refunded: boolean;
  refund_id: string | null;
  created_at: string;
}

export interface ProviderEventView {
  provider: string;
  outcome: string | null;
  received_at: string;
  processed_at: string | null;
  payload: unknown;
}

export interface FinancePaymentDetail extends FinancePayment {
  invoice_id: string | null;
  metadata: Record<string, unknown>;
  refund: { refund_id: string; status: RefundStatus; amount: number } | null;
  provider_events: ProviderEventView[];
}

export interface PaymentFilters {
  status?: string;
  provider?: string;
  type?: string;
  q?: string;
  from?: string;
  to?: string;
  user_id?: string;
  page?: number;
  limit?: number;
}

export const useFinancePaymentsQuery = (filters: PaymentFilters) =>
  useQuery({
    queryKey: [...FINANCE_KEY, "payments", filters],
    queryFn: async () =>
      (
        await apiClient.get<Paged<FinancePayment>>(
          `/admin/finance/payments${toQuery({ ...filters })}`,
        )
      ).data,
    placeholderData: keepPreviousData,
  });

export const useFinancePaymentQuery = (paymentId: string | null) =>
  useQuery({
    queryKey: [...FINANCE_KEY, "payment", paymentId],
    queryFn: async () =>
      (await apiClient.get<FinancePaymentDetail>(`/admin/finance/payments/${paymentId}`)).data,
    enabled: !!paymentId,
  });

export interface FinanceInvoice {
  invoice_id: string;
  number: string;
  user_id: string;
  user_name: string;
  status: "draft" | "open" | "paid" | "void";
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  billing_cycle: string | null;
  period_start: string | null;
  period_end: string | null;
  issued_at: string;
  paid_at: string | null;
}

export interface FinanceInvoiceDetail extends FinanceInvoice {
  notes: string | null;
  lines: {
    kind: string;
    description: string;
    quantity: number;
    unit_amount: number;
    amount: number;
  }[];
  payments: FinancePayment[];
  credit_notes: { number: string; amount: number; reason: string | null; issued_at: string }[];
}

export interface InvoiceFilters {
  status?: string;
  q?: string;
  from?: string;
  to?: string;
  user_id?: string;
  page?: number;
  limit?: number;
}

export const useFinanceInvoicesQuery = (filters: InvoiceFilters) =>
  useQuery({
    queryKey: [...FINANCE_KEY, "invoices", filters],
    queryFn: async () =>
      (
        await apiClient.get<Paged<FinanceInvoice>>(
          `/admin/finance/invoices${toQuery({ ...filters })}`,
        )
      ).data,
    placeholderData: keepPreviousData,
  });

export const useFinanceInvoiceQuery = (invoiceId: string | null) =>
  useQuery({
    queryKey: [...FINANCE_KEY, "invoice", invoiceId],
    queryFn: async () =>
      (await apiClient.get<FinanceInvoiceDetail>(`/admin/finance/invoices/${invoiceId}`)).data,
    enabled: !!invoiceId,
  });

// --- refunds ---

export type RefundStatus = "requested" | "approved" | "rejected" | "paid";
export type RefundReasonCode =
  | "duplicate"
  | "service_issue"
  | "billing_error"
  | "goodwill"
  | "other";

export const REFUND_REASONS: { value: RefundReasonCode; label: string }[] = [
  { value: "duplicate", label: "Charged twice" },
  { value: "billing_error", label: "Billing error" },
  { value: "service_issue", label: "Service problem" },
  { value: "goodwill", label: "Goodwill" },
  { value: "other", label: "Other" },
];

export interface FinanceRefund {
  refund_id: string;
  payment_id: string;
  invoice_id: string | null;
  user_id: string;
  user_name: string | null;
  amount: number;
  currency: string;
  reason_code: RefundReasonCode;
  reason: string | null;
  status: RefundStatus;
  requested_by: string | null;
  requested_by_name: string | null;
  approved_by: string | null;
  approved_by_name: string | null;
  requested_at: string;
  decided_at: string | null;
}

export const useFinanceRefundsQuery = (filters: {
  status?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: [...FINANCE_KEY, "refunds", filters],
    queryFn: async () =>
      (
        await apiClient.get<Paged<FinanceRefund>>(
          `/admin/finance/refunds${toQuery({ ...filters })}`,
        )
      ).data,
    placeholderData: keepPreviousData,
  });

export const useRequestRefundMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      payment_id: string;
      reason: string;
      reason_code: RefundReasonCode;
      amount?: number;
    }) => (await apiClient.post<FinanceRefund>("/admin/finance/refunds", body)).data,
    onSuccess: () => {
      toast.success("Refund requested. A second finance approver must approve it.");
      queryClient.invalidateQueries({ queryKey: FINANCE_KEY });
    },
    onError: (error) => toast.error(errorMessage(error, "Could not request the refund.")),
  });
};

export const useDecideRefundMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      refundId,
      decision,
      note,
    }: {
      refundId: string;
      decision: "approve" | "reject";
      note?: string;
    }) =>
      (
        await apiClient.post<FinanceRefund>(`/admin/finance/refunds/${refundId}/${decision}`, {
          note,
        })
      ).data,
    onSuccess: (refund) => {
      toast.success(
        refund.status === "approved" ? "Refund approved and recorded." : "Refund rejected.",
      );
      queryClient.invalidateQueries({ queryKey: FINANCE_KEY });
      queryClient.invalidateQueries({ queryKey: ["admin_approvals"] });
    },
    onError: (error) => toast.error(errorMessage(error, "Could not decide the refund.")),
  });
};

// --- plans ---

export const useArchivePlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ planId, archived }: { planId: string; archived: boolean }) =>
      (await apiClient.post(`/admin/finance/plans/${planId}/${archived ? "archive" : "restore"}`))
        .data,
    onSuccess: (_, { archived }) => {
      toast.success(archived ? "Plan archived. It can no longer be bought." : "Plan restored.");
      queryClient.invalidateQueries({ queryKey: FINANCE_KEY });
    },
    onError: (error) => toast.error(errorMessage(error, "Could not update the plan.")),
  });
};

// --- treasurer account ---

export interface UsageMeter {
  used: number;
  limit: number | null;
  percent: number | null;
}

export interface FinanceAccount {
  user: {
    user_id: string;
    name: string;
    email: string | null;
    phone_number: string | null;
    slug: string | null;
    joined_at: string | null;
    has_used_trial: boolean;
    is_active: boolean;
  };
  subscription: {
    subscription_id: string;
    plan_id: string | null;
    plan_name: string | null;
    state: SubscriptionState;
    is_trial: boolean;
    is_auto_renew: boolean;
    start_date: string | null;
    end_date: string | null;
  } | null;
  balance: {
    lifetime_paid: number;
    lifetime_refunded: number;
    lifetime_value: number;
    currency: string;
  };
  usage: { groups: UsageMeter; campaigns: UsageMeter; transactions_this_month: UsageMeter };
  invoices: FinanceInvoice[];
  payments: FinancePayment[];
  refunds: FinanceRefund[];
  events: {
    type: string;
    from_plan: string | null;
    to_plan: string | null;
    period_end: string | null;
    reason: string | null;
    actor_id: string | null;
    at: string;
  }[];
}

export const useFinanceAccountQuery = (identifier: string) =>
  useQuery({
    queryKey: [...FINANCE_KEY, "account", identifier],
    queryFn: async () =>
      (await apiClient.get<FinanceAccount>(`/admin/finance/accounts/${identifier}`)).data,
    enabled: !!identifier,
  });
