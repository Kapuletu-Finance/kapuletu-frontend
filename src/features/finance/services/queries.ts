import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface Plan {
  id: string;
  name: string;
  price: number;
  limits: {
    max_groups: number;
    max_campaigns: number;
    max_transactions_per_month: number;
  };
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
