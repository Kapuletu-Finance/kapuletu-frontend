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
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import {
  useMarkAllNotificationsReadMutation,
  useNotificationsQuery,
} from "@/features/notifications/services/queries";
import { notificationToDisplay } from "@/features/notifications/utils";
import IconLibrary from "@/features/shared/components/IconLibrary";

const NotificationsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useNotificationsQuery();
  const markAllRead = useMarkAllNotificationsReadMutation();

  const notifications = (data?.notifications ?? []).map(notificationToDisplay);
  const unreadCount = data?.unread_count ?? 0;
  const displayedNotifications = notifications.slice(0, 5);

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="relative shrink-0 size-9 inline-flex items-center justify-center hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <IconLibrary name="notification" className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-md flex items-center justify-center border-2 border-background">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[85vw] max-w-sm sm:max-w-none sm:w-105 overflow-hidden border-border bg-background"
      >
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-xl">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="link"
                size="sm"
                onClick={handleMarkAllRead}
                disabled={markAllRead.isPending}
                className="text-sm font-medium"
              >
                Mark all as read
              </Button>
            )}
          </div>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-1">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No notifications yet.
                </p>
              ) : (
                displayedNotifications.map((notification, index) => (
                  <div key={notification.id}>
                    <NotificationItem notification={notification} variant="menu" />
                    {index < displayedNotifications.length - 1 && (
                      <div className="h-px w-full bg-border/40 my-1 mx-auto max-w-[90%]" />
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {notifications.length > 5 && (
          <div className="p-4 pt-2 text-center bg-background sticky bottom-0">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold text-primary hover:underline"
            >
              View all
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
