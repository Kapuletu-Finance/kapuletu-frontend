import { useQuery } from "@tanstack/react-query";
import type { PaginatedPendingResponse } from "@/features/shared/types";
import { apiClient } from "@/lib/api-client";

export const pendingInboxKey = ["inbox", "pending"] as const;

export const usePendingInboxCountQuery = () => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<PaginatedPendingResponse>("/inbox/pending", {
        params: { skip: 0, limit: 1 },
      });
      return response.data.total_items;
    },
    queryKey: pendingInboxKey,
  });
};

export const usePendingInboxQuery = (params: {
  skip?: number;
  limit?: number;
  search?: string;
  filter?: string;
  status?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}) => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<PaginatedPendingResponse>("/inbox/pending", {
        params: {
          skip: params.skip,
          limit: params.limit,
          search: params.search,
          filter: params.filter,
          status: params.status,
          sort_by: params.sort_by,
          sort_order: params.sort_order,
        },
      });
      return response.data;
    },
    queryKey: [...pendingInboxKey, params],
  });
};
