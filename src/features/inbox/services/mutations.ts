import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { pendingInboxKey } from "@/features/inbox/services/queries";
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
      // Refresh campaign stats card (total_raised, contributor_count)
      queryClient.invalidateQueries({ queryKey: ["campaign"] });
      // Refresh the Contributions tab & Recent Contributions card
      queryClient.invalidateQueries({ queryKey: ["campaign-transactions"] });
      // Refresh the activity feed
      queryClient.invalidateQueries({ queryKey: ["campaign-activities"] });
      // Refresh the progress chart
      queryClient.invalidateQueries({ queryKey: ["campaign-chart-data"] });
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
      // Fix: use the correct structural key ["inbox", "pending"]
      queryClient.invalidateQueries({ queryKey: pendingInboxKey });
      // Refresh campaign stats
      queryClient.invalidateQueries({ queryKey: ["campaign"] });
      // Refresh the Contributions tab & Recent Contributions card
      queryClient.invalidateQueries({ queryKey: ["campaign-transactions"] });
      // Refresh the activity feed
      queryClient.invalidateQueries({ queryKey: ["campaign-activities"] });
      // Refresh the progress chart
      queryClient.invalidateQueries({ queryKey: ["campaign-chart-data"] });
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
      // Fix: use the correct structural key ["inbox", "pending"]
      queryClient.invalidateQueries({ queryKey: pendingInboxKey });
      // Refresh campaign stats in case a campaign was associated
      queryClient.invalidateQueries({ queryKey: ["campaign"] });
      // Refresh the activity feed
      queryClient.invalidateQueries({ queryKey: ["campaign-activities"] });
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
    onSuccess: (data) => {
      // Bulk API returns {results: [...]} — not an array directly
      const results = Array.isArray(data) ? data : (data?.results ?? []);
      const failed = results.filter((item: any) => item.status === "error");
      if (failed.length > 0) {
        toast.error(`Failed to approve ${failed.length} contribution(s). ${failed[0]?.message?.split('\n')[0]}`);
      } else {
        toast.success(`Approved ${results.length} contribution(s)!`);
      }
      
      // Fix: use the correct structural key ["inbox", "pending"]
      queryClient.invalidateQueries({ queryKey: pendingInboxKey });
      // Refresh campaign stats
      queryClient.invalidateQueries({ queryKey: ["campaign"] });
      // Refresh the Contributions tab & Recent Contributions card
      queryClient.invalidateQueries({ queryKey: ["campaign-transactions"] });
      // Refresh the activity feed
      queryClient.invalidateQueries({ queryKey: ["campaign-activities"] });
      // Refresh the progress chart
      queryClient.invalidateQueries({ queryKey: ["campaign-chart-data"] });
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
    onSuccess: (data) => {
      // Bulk API returns {results: [...]} — not an array directly
      const results = Array.isArray(data) ? data : (data?.results ?? []);
      const failed = results.filter((item: any) => item.status === "error");
      if (failed.length > 0) {
        toast.error(`Failed to reject ${failed.length} contribution(s). ${failed[0]?.message?.split('\n')[0]}`);
      } else {
        toast.success(`Rejected ${results.length} contribution(s)!`);
      }
      // Fix: use the correct structural key ["inbox", "pending"]
      queryClient.invalidateQueries({ queryKey: pendingInboxKey });
      // Refresh campaign stats in case items were campaign-linked
      queryClient.invalidateQueries({ queryKey: ["campaign"] });
      // Refresh the activity feed
      queryClient.invalidateQueries({ queryKey: ["campaign-activities"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to bulk reject contributions.");
    },
  });
};
