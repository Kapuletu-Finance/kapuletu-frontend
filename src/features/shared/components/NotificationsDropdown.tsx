import type React from "react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import IconLibrary, { type IconName } from "@/features/shared/components/IconLibrary";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: IconName;
  iconClassName?: string;
  iconBgClassName?: string;
  unread: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New contribution received",
    message: "Ksh. 5000 has been received from John Doe for Medical Fund.",
    time: "Just now",
    icon: "transaction",
    iconClassName: "text-emerald-600",
    iconBgClassName: "bg-emerald-100 dark:bg-emerald-900/30",
    unread: true,
  },
  {
    id: "2",
    title: "Password reset successful",
    message:
      "Your password has been successfully reset. You can use your new password when logging in.",
    time: "2m ago",
    icon: "key",
    iconClassName: "text-blue-600",
    iconBgClassName: "bg-blue-100 dark:bg-blue-900/30",
    unread: true,
  },
  {
    id: "3",
    title: "Monthly report is ready",
    message: "June 2026 report has been generated and is ready to view.",
    time: "20m ago",
    icon: "report",
    iconClassName: "text-orange-600",
    iconBgClassName: "bg-orange-100 dark:bg-orange-900/30",
    unread: false,
  },
  {
    id: "4",
    title: "Campaign goal achieved.",
    message: "You've reached your target amount for campaign X.",
    time: "1h ago",
    icon: "campaign",
    iconClassName: "text-emerald-600",
    iconBgClassName: "bg-emerald-100 dark:bg-emerald-900/30",
    unread: false,
  },
  {
    id: "5",
    title: "New contribution received",
    message: "Ksh. 5000 has been received from John Doe for Medical Fund.",
    time: "1d ago",
    icon: "transaction",
    iconClassName: "text-blue-600",
    iconBgClassName: "bg-blue-100 dark:bg-blue-900/30",
    unread: false,
  },
  {
    id: "6",
    title: "Monthly report is ready",
    message: "June 2026 report has been generated and is ready to view.",
    time: "1d ago",
    icon: "report",
    iconClassName: "text-orange-600",
    iconBgClassName: "bg-orange-100 dark:bg-orange-900/30",
    unread: false,
  },
  {
    id: "7",
    title: "New contribution received",
    message: "Ksh. 5000 has been received from John Doe for Medical Fund.",
    time: "2d ago",
    icon: "transaction",
    iconClassName: "text-emerald-600",
    iconBgClassName: "bg-emerald-100 dark:bg-emerald-900/30",
    unread: true,
  },
  {
    id: "8",
    title: "Password reset successful",
    message:
      "Your password has been successfully reset. You can use your new password when logging in.",
    time: "2d ago",
    icon: "key",
    iconClassName: "text-blue-600",
    iconBgClassName: "bg-blue-100 dark:bg-blue-900/30",
    unread: true,
  },
  {
    id: "9",
    title: "Campaign goal achieved.",
    message: "You've reached your target amount for campaign X.",
    time: "2d ago",
    icon: "campaign",
    iconClassName: "text-emerald-600",
    iconBgClassName: "bg-emerald-100 dark:bg-emerald-900/30",
    unread: false,
  },
];

const NotificationsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="relative rounded-full shrink-0 size-9 inline-flex items-center justify-center hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <IconLibrary name="notification" className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-background">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[85vw] max-w-sm sm:max-w-none sm:w-105 p-0 rounded-3xl overflow-hidden shadow-xl border-border bg-background"
      >
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-xl">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-sm font-medium text-primary hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-1">
              {displayedNotifications.map((notification, index) => (
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
              ))}
            </div>
          </ScrollArea>
        </div>

        {notifications.length > 5 && (
          <div className="p-4 pt-2 text-center bg-background sticky bottom-0">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-bold text-primary hover:underline py-2"
            >
              {showAll ? "View less" : "View all"}
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
