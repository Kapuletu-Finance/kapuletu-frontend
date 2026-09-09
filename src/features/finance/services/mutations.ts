import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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

export const useExportReceiptPdfMutation = () => {
  return useMutation({
    mutationFn: async (paymentId: string) => {
      const response = await apiClient.get(`/finance/receipt/${paymentId}`, {
        responseType: "blob",
      });
      return { data: response.data, paymentId };
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to download receipt.");
    },
    onSuccess: ({ data, paymentId }) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};
