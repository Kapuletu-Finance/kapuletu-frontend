"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import {
  useMarkAllNotificationsReadMutation,
  useNotificationsQuery,
} from "@/features/notifications/services/queries";
import { notificationToDisplay } from "@/features/notifications/utils";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const NotificationsPageClient = () => {
  const { data, isLoading } = useNotificationsQuery();
  const markAllRead = useMarkAllNotificationsReadMutation();

  const notifications = (data?.notifications ?? []).map(notificationToDisplay);
  const unreadCount = data?.unread_count ?? 0;

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/10 p-6 md:p-8 lg:p-12 space-y-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Home</span>
        <IconLibrary name="chevron-right" className="w-4 h-4" />
        <span className="font-medium text-foreground">Notifications</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80 font-medium"
            onClick={handleMarkAllRead}
            disabled={markAllRead.isPending}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((id) => (
              <div
                key={id}
                className="flex items-center gap-4 p-4 rounded-lg bg-background border border-border/50 shadow-sm"
              >
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex flex-1 items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-62.5 max-w-[50%]" />
                    <Skeleton className="h-3 w-100 max-w-[80%]" />
                  </div>
                  <div className="flex items-center gap-6 shrink-0 pl-4">
                    <Skeleton className="h-3 w-10" />
                    <div className="w-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-background rounded-lg p-12 text-center text-muted-foreground shadow-sm border border-border/50">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} variant="page" />
          ))
        )}
      </div>
    </div>
  );
};
