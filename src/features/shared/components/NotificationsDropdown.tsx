"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useMarkAllNotificationsReadMutation,
  useNotificationsQuery,
} from "@/features/notifications/services/queries";
import IconLibrary, { type IconName } from "@/features/shared/components/IconLibrary";
import type { NotificationOut } from "@/features/shared/types";
import { cn } from "@/lib/utils";

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function notificationToDisplay(n: NotificationOut) {
  const typeIconMap: Record<
    string,
    { icon: IconName; iconClassName: string; iconBgClassName: string }
  > = {
    transaction_approved: {
      icon: "transaction",
      iconClassName: "text-primary",
      iconBgClassName: "bg-primary/10 dark:bg-primary/30",
    },
    transaction_rejected: {
      icon: "transaction",
      iconClassName: "text-destructive",
      iconBgClassName: "bg-destructive/10 dark:bg-destructive/30",
    },
    campaign_created: {
      icon: "campaign",
      iconClassName: "text-primary",
      iconBgClassName: "bg-primary/10 dark:bg-primary/30",
    },
    campaign_goal_reached: {
      icon: "campaign",
      iconClassName: "text-primary",
      iconBgClassName: "bg-primary/10 dark:bg-primary/30",
    },
    report_ready: {
      icon: "report",
      iconClassName: "text-orange-600",
      iconBgClassName: "bg-orange-100 dark:bg-orange-900/30",
    },
    password_reset: {
      icon: "key",
      iconClassName: "text-blue-600",
      iconBgClassName: "bg-blue-100 dark:bg-blue-900/30",
    },
  };

  const fallback = {
    icon: "notification" as IconName,
    iconClassName: "text-muted-foreground",
    iconBgClassName: "bg-muted",
  };
  const mapped = typeIconMap[n.type] || fallback;

  return {
    id: n.notification_id,
    title: n.title,
    message: n.message,
    time: timeAgo(n.created_at),
    icon: mapped.icon,
    iconClassName: mapped.iconClassName,
    iconBgClassName: mapped.iconBgClassName,
    unread: !n.is_read,
  };
}

const NotificationsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const { data } = useNotificationsQuery();
  const markAllRead = useMarkAllNotificationsReadMutation();

  const notifications = (data?.notifications ?? []).map(notificationToDisplay);
  const unreadCount = data?.unread_count ?? 0;
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

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
                    <div
                      className={cn(
                        "flex gap-4 items-start p-4 rounded-2xl transition-colors",
                        notification.unread ? "bg-muted/40" : "hover:bg-muted/20",
                      )}
                    >
                      <div
                        className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                          notification.iconBgClassName || "bg-muted",
                        )}
                      >
                        <IconLibrary
                          name={notification.icon}
                          className={cn(
                            "h-5 w-5",
                            notification.iconClassName || "text-muted-foreground",
                          )}
                        />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold leading-none">{notification.title}</p>
                          {notification.unread && (
                            <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pr-4">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 font-medium pt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
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
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-bold"
            >
              {showAll ? "View less" : "View all"}
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
