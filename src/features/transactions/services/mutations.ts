import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TRANSACTIONS_URLS } from "@/features/transactions/urls";
import { apiClient } from "@/lib/api-client";

interface AddContributionData {
  sender_name: string;
  sender_phone?: string;
  amount: number;
  payment_method: string;
  campaign_id?: string;
}

export const useAddManualContributionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddContributionData) => {
      const response = await apiClient.post(TRANSACTIONS_URLS.MANUAL_ENTRY, data);
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to add contribution.");
    },
    onSuccess: () => {
      toast.success("Contribution added successfully!");
      // We will invalidate campaigns to update stats
      queryClient.invalidateQueries({ queryKey: ["campaign"] });
    },
  });
};
