import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const useEmployeeReportsQuery = (userId?: string) => {
  return useQuery({
    queryKey: ["hr", "reports", userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await apiClient.get(`/hr/reports/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });
};

export const useMeetingsQuery = () => {
  return useQuery({
    queryKey: ["hr", "meetings"],
    queryFn: async () => {
      const res = await apiClient.get("/hr/meetings");
      return res.data;
    },
  });
};
