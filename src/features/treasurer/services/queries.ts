import { useQuery } from "@tanstack/react-query";
import type { DashboardOverviewOut, WorkspaceOverviewOut, GlobalSearchOut } from "@/features/shared/types";
import { TREASURER_URLS } from "@/features/treasurer/urls";
import { apiClient } from "@/lib/api-client";

export const workspaceOverviewKey = ["workspace", "overview"] as const;
export const dashboardSummaryKey = ["reports", "dashboard"] as const;

export const useWorkspaceOverviewQuery = () => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<WorkspaceOverviewOut>(TREASURER_URLS.WORKSPACE_OVERVIEW);
      return response.data;
    },
    queryKey: workspaceOverviewKey,
  });
};

export const useDashboardSummaryQuery = () => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<DashboardOverviewOut>(TREASURER_URLS.DASHBOARD_SUMMARY);
      return response.data;
    },
    queryKey: dashboardSummaryKey,
  });
};

export const useGlobalSearchQuery = (query: string) => {
  return useQuery({
    queryKey: ["workspace", "search", query],
    queryFn: async () => {
      const response = await apiClient.get<GlobalSearchOut>(
        `${TREASURER_URLS.WORKSPACE_SEARCH}?q=${encodeURIComponent(query)}`
      );
      return response.data;
    },
    enabled: query.length >= 2,
  });
};
