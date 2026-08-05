import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { campaignsQueryKey } from "@/features/campaigns/services/queries";
import { CAMPAIGNS_URLS } from "@/features/campaigns/urls";
import { GROUPS_URLS } from "@/features/groups/urls";
import type { CampaignCreate, CampaignOut, CampaignUpdate } from "@/features/shared/types";
import { apiClient } from "@/lib/api-client";

export const useRegenerateCampaignPinMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<{ pin: string }>(
        CAMPAIGNS_URLS.campaignRegeneratePin(campaignId),
      );
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to regenerate PIN.");
    },
    onSuccess: () => {
      toast.success("PIN regenerated successfully!");
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
    },
  });
};

export const useVerifyCampaignPinMutation = (campaignId: string) => {
  return useMutation({
    mutationFn: async (pin: string) => {
      const response = await apiClient.post<CampaignOut>(
        CAMPAIGNS_URLS.publicCampaignVerify(campaignId),
        undefined,
        { params: { pin } },
      );
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Invalid PIN.");
    },
    onSuccess: () => {
      toast.success("Access granted!");
    },
  });
};

export const useCreateCampaignMutation = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CampaignCreate) => {
      const response = await apiClient.post<CampaignOut>(GROUPS_URLS.groupCampaigns(groupId), data);
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create campaign.");
    },
    onSuccess: () => {
      toast.success("Campaign created successfully!");
      queryClient.invalidateQueries({ queryKey: campaignsQueryKey });
    },
  });
};

export const useUpdateCampaignMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CampaignUpdate) => {
      const response = await apiClient.patch<CampaignOut>(
        CAMPAIGNS_URLS.campaignDetail(campaignId),
        data,
      );
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update campaign.");
    },
    onSuccess: () => {
      toast.success("Campaign updated successfully!");
      queryClient.invalidateQueries({ queryKey: campaignsQueryKey });
    },
  });
};

export const useArchiveCampaignMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete<CampaignOut>(
        CAMPAIGNS_URLS.campaignDetail(campaignId),
      );
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to archive campaign.");
    },
    onSuccess: () => {
      toast.success("Campaign archived successfully!");
      queryClient.invalidateQueries({ queryKey: campaignsQueryKey });
    },
  });
};

export const useToggleCampaignFavoriteMutation = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.patch<CampaignOut>(
        CAMPAIGNS_URLS.campaignFavorite(campaignId),
      );
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update favorite.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignsQueryKey });
    },
  });
};

export const useExportCampaignPdfMutation = (campaignId: string) => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.get(CAMPAIGNS_URLS.campaignExportPdf(campaignId), {
        responseType: "blob",
      });
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to download PDF.");
    },
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `campaign-${campaignId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};

export const useExportCampaignExcelMutation = (campaignId: string) => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.get(CAMPAIGNS_URLS.campaignExportExcel(campaignId), {
        responseType: "blob",
      });
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to download Excel.");
    },
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `campaign-${campaignId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};
