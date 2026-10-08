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
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });
      const previousNotifications =
        queryClient.getQueryData<NotificationListOut>(notificationsQueryKey);

      queryClient.setQueryData<NotificationListOut>(notificationsQueryKey, (current) => {
        if (!current) return current;
        const notification = current.notifications.find(
          (item) => item.notification_id === notificationId,
        );
        if (!notification || notification.is_read) return current;

        return {
          ...current,
          notifications: current.notifications.map((item) =>
            item.notification_id === notificationId ? { ...item, is_read: true } : item,
          ),
          unread_count: Math.max(0, current.unread_count - 1),
        };
      });

      return { previousNotifications };
    },
    onError: (_error, _notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(notificationsQueryKey, context.previousNotifications);
      }
      toast.error("Failed to mark notification as read.");
    },
    onSettled: () => {
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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });
      const previousNotifications =
        queryClient.getQueryData<NotificationListOut>(notificationsQueryKey);

      queryClient.setQueryData<NotificationListOut>(notificationsQueryKey, (current) => {
        if (!current) return current;
        return {
          ...current,
          notifications: current.notifications.map((item) => ({ ...item, is_read: true })),
          unread_count: 0,
        };
      });

      return { previousNotifications };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(notificationsQueryKey, context.previousNotifications);
      }
      toast.error("Failed to mark all notifications as read.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    },
  });
};
