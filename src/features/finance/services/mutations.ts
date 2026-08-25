import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface CheckoutPayload {
  plan_id: string;
  provider: string;
  phone_number?: string;
  email?: string;
  name?: string;
  billing_cycle?: string;
  has_addons?: boolean;
}

interface CheckoutResponse {
  checkout_id: string;
  status: string;
  provider_response: Record<string, unknown>;
}

export const useInitiateCheckoutMutation = () => {
  return useMutation({
    mutationFn: async (payload: CheckoutPayload): Promise<CheckoutResponse> => {
      const response = await apiClient.post<CheckoutResponse>("/finance/checkout", payload);
      return response.data;
    },
  });
};

export const useActivateTrialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<{ message: string; status: string }> => {
      const response = await apiClient.post<{ message: string; status: string }>(
        "/finance/activate-trial",
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
