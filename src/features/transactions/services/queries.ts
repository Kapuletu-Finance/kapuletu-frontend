import { useQuery } from "@tanstack/react-query";
import type { PaginatedPendingResponse } from "@/features/shared/types";
import { apiClient } from "@/lib/api-client";

export const pendingTransactionsKey = ["transactions", "pending"] as const;

export const usePendingTransactionsCountQuery = () => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<PaginatedPendingResponse>("/transactions/pending", {
        params: { skip: 0, limit: 1 },
      });
      return response.data.total_items;
    },
    queryKey: pendingTransactionsKey,
  });
};
