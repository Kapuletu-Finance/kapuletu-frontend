import { useQuery } from "@tanstack/react-query";
import type { AuthResponse } from "@/features/auth/types";
import { AUTH_URLS } from "@/features/auth/urls";
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
