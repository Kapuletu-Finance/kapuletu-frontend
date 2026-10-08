import type React from "react";
import type { IconName } from "@/features/shared/components/IconLibrary";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn } from "@/lib/utils";

export interface DisplayNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  iconBgClassName?: string;
  icon: IconName;
  iconClassName?: string;
}

interface NotificationItemProps {
  notification: DisplayNotification;
  variant?: "menu" | "page";
  onMarkRead?: (notificationId: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  variant = "menu",
  onMarkRead,
}) => {
  const isPage = variant === "page";

  const className = cn(
    "flex w-full min-w-0 gap-3 p-3 text-left transition-colors sm:gap-4 sm:p-4",
    isPage ? "items-start rounded-xl sm:items-center" : "items-start rounded-2xl",
    notification.unread
      ? "bg-muted/40 hover:bg-muted/70"
      : isPage
        ? "border border-border/50 bg-background shadow-sm"
        : "hover:bg-muted/20",
    notification.unread && onMarkRead && "cursor-pointer",
  );

  const content = (
    <>
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          notification.iconBgClassName || "bg-muted",
        )}
      >
        <IconLibrary
          name={notification.icon}
          className={cn("h-5 w-5", notification.iconClassName || "text-muted-foreground")}
        />
      </div>

      {isPage ? (
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="break-words text-sm font-semibold leading-snug">{notification.title}</p>
            <p className="break-words text-xs leading-relaxed text-muted-foreground">
              {notification.message}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4 sm:pl-4">
            <p className="text-xs text-muted-foreground">{notification.time}</p>
            <span
              className={cn(
                "rounded-full px-2 py-1 text-[11px] font-medium",
                notification.unread
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {notification.unread ? "Mark read" : "Read"}
            </span>
          </div>
        </div>
      ) : (
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <p className="break-words text-sm font-semibold leading-snug">{notification.title}</p>
            {notification.unread && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
          </div>
          <p className="break-words pr-1 text-xs leading-relaxed text-muted-foreground">
            {notification.message}
          </p>
          <p className="text-[10px] text-muted-foreground/70 font-medium pt-1">
            {notification.time}
          </p>
        </div>
      )}
    </>
  );

  if (notification.unread && onMarkRead) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => onMarkRead(notification.id)}
        aria-label={`Mark notification as read: ${notification.title}`}
      >
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
};
