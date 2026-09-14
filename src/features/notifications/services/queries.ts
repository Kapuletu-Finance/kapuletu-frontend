import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { NOTIFICATIONS_URLS } from "@/features/notifications/urls";
import type { NotificationListOut } from "@/features/shared/types";
import { apiClient } from "@/lib/api-client";

export const notificationsQueryKey = ["notifications"] as const;

export const useNotificationsQuery = () => {
  return useQuery({
    queryFn: async () => {
      const response = await apiClient.get<NotificationListOut>(NOTIFICATIONS_URLS.list);
      return response.data;
    },
    queryKey: notificationsQueryKey,
  });
};

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await apiClient.patch(NOTIFICATIONS_URLS.markRead(notificationId));
      return response.data;
    },
    onError: () => {
      toast.error("Failed to mark notification as read.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    },
  });
};

export const useMarkAllNotificationsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(NOTIFICATIONS_URLS.markAllRead);
      return response.data;
    },
    onError: () => {
      toast.error("Failed to mark all notifications as read.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    },
  });
};
