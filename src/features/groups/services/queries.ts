import { useQuery } from "@tanstack/react-query";
import { GROUPS_URLS } from "@/features/groups/urls";
import type { PaginatedGroupResponse } from "@/features/shared/types";
import { apiClient } from "@/lib/api-client";

export interface GroupsQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  group_status?: "active" | "archived" | "all";
}

export const groupsQueryKey = ["groups"] as const;

export const useGroupsQuery = (params: GroupsQueryParams = {}) => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<PaginatedGroupResponse>(GROUPS_URLS.BASE_GROUPS, {
        params,
      });
      return response.data;
    },
    queryKey: [...groupsQueryKey, params],
  });
};
