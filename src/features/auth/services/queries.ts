import { useQuery } from "@tanstack/react-query";
import type { AuthResponse, BillingHistoryOut, SubscriptionResponse } from "@/features/auth/types";
import { AUTH_URLS } from "@/features/auth/urls";
import type { UserSettings } from "@/features/shared/types";
import { apiClient } from "@/lib/api-client";

export const useGetMeQuery = () => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<AuthResponse>(AUTH_URLS.ME);
      return response.data;
    },
    queryKey: ["auth", "me"],
  });
};

export const useGetMySubscriptionQuery = () => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<SubscriptionResponse>("/finance/my-subscription");
      return response.data;
    },
    queryKey: ["finance", "subscription"],
  });
};

export const useGetBillingHistoryQuery = () => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<BillingHistoryOut[]>("/finance/billing-history");
      return response.data;
    },
    queryKey: ["finance", "billing-history"],
  });
};

export const useGetSettingsQuery = () => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<UserSettings>("/settings/me");
      return response.data;
    },
    queryKey: ["settings", "me"],
  });
};
