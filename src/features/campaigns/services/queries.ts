import { useQuery } from "@tanstack/react-query";
import { GROUPS_URLS } from "@/features/groups/urls";
import type { PaginatedCampaignResponse } from "@/features/shared/types";
import { apiClient } from "@/lib/api-client";

export interface CampaignsQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  campaign_status?: "active" | "archived" | "all";
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
