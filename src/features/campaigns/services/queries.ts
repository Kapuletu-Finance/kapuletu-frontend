import { useQuery } from "@tanstack/react-query";
import { CAMPAIGNS_URLS } from "@/features/campaigns/urls";
import { GROUPS_URLS } from "@/features/groups/urls";
import type {
  CampaignActivity,
  CampaignOut,
  CampaignReportPreview,
  ChartDataPoint,
  PaginatedCampaignResponse,
  PaginatedInboxResponse,
  PublicWebReportOut,
} from "@/features/shared/types";
import { apiClient } from "@/lib/api-client";

export interface PublicVerifyRequest {
  pin?: string;
  page?: number;
  limit?: number;
}

export const usePublicCampaignReportQuery = (
  shortCode: string,
  data: PublicVerifyRequest,
  enabled: boolean = true,
) => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.post<PublicWebReportOut>(
        CAMPAIGNS_URLS.publicCampaignVerify(shortCode),
        data,
      );
      return response.data;
    },
    queryKey: ["public-campaign-report", shortCode, data],
    enabled: enabled && !!shortCode,
    retry: false, // Don't retry on 403
  });
};

export interface CampaignsQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  campaign_status?: "active" | "archived" | "all";
}

export interface InboxQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const campaignsQueryKey = ["campaigns"] as const;

export const useCampaignsQuery = (groupId: string, params: CampaignsQueryParams = {}) => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<PaginatedCampaignResponse>(
        GROUPS_URLS.groupCampaigns(groupId),
        { params },
      );
      return response.data;
    },
    queryKey: [...campaignsQueryKey, groupId, params],
    enabled: !!groupId,
  });
};

export const useCampaignQuery = (campaignId: string) => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<CampaignOut>(CAMPAIGNS_URLS.campaignDetail(campaignId));
      return response.data;
    },
    queryKey: ["campaign", campaignId],
    enabled: !!campaignId,
  });
};

export const useCampaignInboxQuery = (campaignId: string, params: InboxQueryParams = {}) => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<PaginatedInboxResponse>(
        CAMPAIGNS_URLS.campaignInbox(campaignId),
        { params },
      );
      return response.data;
    },
    queryKey: ["campaign-inbox", campaignId, params],
    enabled: !!campaignId,
  });
};

export const useCampaignTransactionsQuery = (campaignId: string, params: InboxQueryParams = {}) => {
  return useQuery({
    queryFn: async () => {
      // Assuming you import PaginatedTransactionResponse in types.ts
      const response = await apiClient.get<
        import("@/features/shared/types").PaginatedTransactionResponse
      >(CAMPAIGNS_URLS.campaignTransactions(campaignId), { params });
      return response.data;
    },
    queryKey: ["campaign-transactions", campaignId, params],
    enabled: !!campaignId,
  });
};

export const useCampaignActivitiesQuery = (campaignId: string) => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<CampaignActivity[]>(
        CAMPAIGNS_URLS.campaignActivities(campaignId),
      );
      return response.data;
    },
    queryKey: ["campaign-activities", campaignId],
    enabled: !!campaignId,
  });
};

export const useCampaignChartDataQuery = (campaignId: string, filter: string = "this_month") => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<ChartDataPoint[]>(
        CAMPAIGNS_URLS.campaignChartData(campaignId),
        { params: { filter } },
      );
      return response.data;
    },
    queryKey: ["campaign-chart-data", campaignId, filter],
    enabled: !!campaignId,
  });
};

export const useCampaignReportPreviewQuery = (campaignId: string) => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<CampaignReportPreview>(
        CAMPAIGNS_URLS.campaignReportPreview(campaignId),
      );
      return response.data;
    },
    queryKey: ["campaign-report-preview", campaignId],
    enabled: !!campaignId,
  });
};
