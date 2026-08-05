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
