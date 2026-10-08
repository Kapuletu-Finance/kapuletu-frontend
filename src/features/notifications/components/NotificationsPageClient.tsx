"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "@/features/notifications/services/queries";
import { notificationToDisplay } from "@/features/notifications/utils";
import PageLayout from "@/features/shared/components/PageLayout";

export const NotificationsPageClient = () => {
  const { data, isLoading, isError, refetch } = useNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();

  const notifications = (data?.notifications ?? []).map(notificationToDisplay);
  const unreadCount = data?.unread_count ?? 0;

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  return (
    <PageLayout
      title="Notifications"
      actionButton={
        unreadCount > 0 ? (
          <Button
            variant="ghost"
            className="w-full justify-start font-medium text-primary hover:text-primary/80 sm:w-auto sm:justify-center"
            onClick={handleMarkAllRead}
            disabled={markAllRead.isPending}
          >
            Mark all as read
          </Button>
        ) : undefined
      }
    >
      <div className="min-w-0 space-y-3 sm:space-y-4">
        {isLoading ? (
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3, 4, 5].map((id) => (
              <div
                key={id}
                className="flex min-w-0 items-start gap-3 rounded-xl border border-border/50 bg-background p-3 shadow-sm sm:items-center sm:gap-4 sm:p-4"
              >
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex min-w-0 flex-1 items-start justify-between gap-3 sm:items-center">
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-62.5 max-w-[50%]" />
                    <Skeleton className="h-3 w-100 max-w-[80%]" />
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:gap-6 sm:pl-4">
                    <Skeleton className="h-3 w-10" />
                    <div className="w-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-border/50 bg-background px-4 py-10 text-center shadow-sm">
            <p className="text-sm font-medium text-foreground">Notifications couldn’t be loaded.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Check your connection and try again.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => void refetch()}>
              Try again
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-background px-4 py-12 text-center text-muted-foreground shadow-sm">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              variant="page"
              onMarkRead={(notificationId) => markRead.mutate(notificationId)}
            />
          ))
        )}
      </div>
    </PageLayout>
  );
};
