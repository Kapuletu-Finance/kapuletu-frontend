import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface CheckoutPayload {
  plan_id: string;
  provider: string;
  phone_number: string;
  email: string;
  name: string;
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
