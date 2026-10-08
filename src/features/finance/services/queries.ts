import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface Plan {
  id: string;
  /** Stable identifier (basic, bronze, silver, gold, professional); match on this, not the name */
  code: string;
  name: string;
  /** Monthly price; same as monthly_price */
  price: number;
  monthly_price: number;
  annual_price: number;
  currency: string;
  limits: {
    max_groups: number;
    max_campaigns: number;
    max_transactions_per_month: number;
  };
  allowed_features: Record<string, unknown>;
}

export interface PricingConfig {
  currency: string;
  trial_days: number;
  annual_months_charged: number;
  addon_monthly_price: number;
  tax_rate_percent: number;
}

export interface QuoteLine {
  kind: "plan" | "addon" | "tax" | string;
  description: string;
  quantity: number;
  unit_amount: number;
  amount: number;
}

export interface Quote {
  plan_id: string;
  plan_name: string;
  billing_cycle: "monthly" | "annual";
  has_addons: boolean;
  currency: string;
  lines: QuoteLine[];
  subtotal: number;
  tax_rate_percent: number;
  tax: number;
  total: number;
}

export interface PaymentStatus {
  status: string;
  confirmed_at: string | null;
  plan: string | null;
}

export const useGetAvailablePlansQuery = () => {
  return useQuery({
    queryKey: ["available-plans"],
    queryFn: async (): Promise<Plan[]> => {
      const response = await apiClient.get<Plan[]>("/finance/available-plans");
      return response.data;
    },
  });
};

export const usePricingConfigQuery = () => {
  return useQuery({
    queryKey: ["pricing-config"],
    queryFn: async (): Promise<PricingConfig> => {
      const response = await apiClient.get<PricingConfig>("/finance/pricing-config");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/** The server's price for a checkout, line by line. The browser never computes prices itself. */
export const useCheckoutQuoteQuery = (
  planId: string | undefined,
  billingCycle: string,
  hasAddons: boolean,
) => {
  return useQuery({
    queryKey: ["checkout-quote", planId, billingCycle, hasAddons],
    queryFn: async (): Promise<Quote> => {
      const response = await apiClient.post<Quote>("/finance/quote", {
        plan_id: planId,
        billing_cycle: billingCycle,
        has_addons: hasAddons,
      });
      return response.data;
    },
    enabled: !!planId,
    placeholderData: (previous) => previous,
  });
};

export const useGetPaymentStatusQuery = (checkoutId: string | null) => {
  return useQuery({
    queryKey: ["payment-status", checkoutId],
    queryFn: async (): Promise<PaymentStatus> => {
      const response = await apiClient.get<PaymentStatus>(`/finance/status/${checkoutId}`);
      return response.data;
    },
    enabled: !!checkoutId,
    refetchInterval: (query) => {
      // Poll every 3 seconds if status is still pending
      const data = query.state.data;
      if (!data || data.status === "pending" || data.status === "initiated") {
        return 3000;
      }
      return false; // Stop polling
    },
  });
};

export interface MyInvoice {
  invoice_id: string;
  number: string;
  status: "open" | "paid";
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  billing_cycle: string | null;
  period_start: string | null;
  period_end: string | null;
  issued_at: string;
  paid_at: string | null;
  lines: { description: string; quantity: number; amount: number }[];
}

export const useMyInvoicesQuery = () =>
  useQuery({
    queryKey: ["my-invoices"],
    queryFn: async () => (await apiClient.get<MyInvoice[]>("/finance/invoices")).data,
  });
