import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { INBOX_URLS } from "@/features/inbox/urls";
import { apiClient } from "@/lib/api-client";

interface AddContributionData {
  sender_name: string;
  sender_phone?: string;
  amount: number;
  payment_method: string;
  campaign_id: string;
  group_id: string;
}

export const useAddManualContributionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddContributionData) => {
      const response = await apiClient.post(INBOX_URLS.MANUAL_ENTRY, data);
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

export interface ApproveTransactionData {
  group_id?: string;
  campaign_id?: string;
  internal_note?: string;
}

export const useApproveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ApproveTransactionData }) => {
      const response = await apiClient.post(INBOX_URLS.approve(id), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox-pending"] });
      queryClient.invalidateQueries({ queryKey: ["campaign"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to approve contribution.");
    },
  });
};

export const useRejectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(INBOX_URLS.reject(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox-pending"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to reject contribution.");
    },
  });
};

export interface BulkActionData {
  pending_ids: string[];
  group_id?: string;
  campaign_id?: string;
  internal_note?: string;
}

export const useBulkApproveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: BulkActionData) => {
      const response = await apiClient.post(INBOX_URLS.BULK_APPROVE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox-pending"] });
      queryClient.invalidateQueries({ queryKey: ["campaign"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to bulk approve contributions.");
    },
  });
};

export const useBulkRejectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { pending_ids: string[] }) => {
      const response = await apiClient.post(INBOX_URLS.BULK_REJECT, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox-pending"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to bulk reject contributions.");
    },
  });
};
