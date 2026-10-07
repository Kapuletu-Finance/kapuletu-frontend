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

export const useOfficeLocationQuery = () => {
  return useQuery({
    queryKey: ["hr", "office-location"],
    queryFn: async () => {
      const res = await apiClient.get("/hr/office-location");
      return res.data as {
        id: string;
        location_name: string;
        latitude: string;
        longitude: string;
        radius_meters: string;
        updated_at: string | null;
      };
    },
    retry: false, // Don't retry if 404 (not configured yet)
  });
};
