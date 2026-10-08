"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "@/features/notifications/services/queries";
import { notificationToDisplay } from "@/features/notifications/utils";
import IconLibrary from "@/features/shared/components/IconLibrary";

const NotificationsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();

  const notifications = (data?.notifications ?? []).map(notificationToDisplay);
  const unreadCount = data?.unread_count ?? 0;
  const displayedNotifications = notifications.slice(0, 5);

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="relative shrink-0 size-9 inline-flex items-center justify-center hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <IconLibrary name="notification" className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-md flex items-center justify-center border-2 border-background">
                {unreadCount}
              </span>
            )}
          </button>
        }
      />
      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] overflow-hidden border-border bg-background sm:w-105 sm:max-w-none"
      >
        <div className="p-4 pb-2 sm:p-6 sm:pb-2">
          <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <h3 className="text-lg font-semibold sm:text-xl">Notifications</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold text-primary hover:underline"
              >
                View all
              </Link>
              {unreadCount > 0 && (
                <>
                  <span className="text-muted-foreground text-xs">•</span>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleMarkAllRead}
                    disabled={markAllRead.isPending}
                    className="text-sm font-medium p-0 h-auto"
                  >
                    Mark all as read
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="max-h-[min(60vh,30rem)] w-full overflow-y-auto overscroll-contain pr-2 sm:pr-4">
            <div className="space-y-1">
              {isLoading ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Loading notifications…
                </p>
              ) : isError ? (
                <div className="px-2 py-8 text-center">
                  <p className="text-sm text-muted-foreground">Notifications couldn’t be loaded.</p>
                  <Button variant="link" size="sm" onClick={() => void refetch()} className="mt-1">
                    Try again
                  </Button>
                </div>
              ) : notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No notifications yet.
                </p>
              ) : (
                displayedNotifications.map((notification, index) => (
                  <div key={notification.id}>
                    <NotificationItem
                      notification={notification}
                      variant="menu"
                      onMarkRead={(notificationId) => markRead.mutate(notificationId)}
                    />
                    {index < displayedNotifications.length - 1 && (
                      <div className="h-px w-full bg-border/40 my-1 mx-auto max-w-[90%]" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
