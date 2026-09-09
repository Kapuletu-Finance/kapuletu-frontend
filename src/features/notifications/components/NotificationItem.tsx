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
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  variant = "menu",
}) => {
  const isPage = variant === "page";

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 transition-colors",
        isPage ? "rounded-lg" : "rounded-2xl items-start",
        notification.unread
          ? "bg-muted/40"
          : isPage
            ? "bg-background border border-border/50 shadow-sm"
            : "hover:bg-muted/20",
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
          className={cn("h-5 w-5", notification.iconClassName || "text-muted-foreground")}
        />
      </div>

      {isPage ? (
        <div className="flex flex-1 items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold leading-none">{notification.title}</p>
            <p className="text-xs text-muted-foreground">{notification.message}</p>
          </div>
          <div className="flex items-center gap-6 shrink-0 pl-4">
            <p className="text-xs text-muted-foreground">{notification.time}</p>
            <div className="w-2 flex justify-center">
              {notification.unread && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold leading-none">{notification.title}</p>
            {notification.unread && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pr-4">
            {notification.message}
          </p>
          <p className="text-[10px] text-muted-foreground/70 font-medium pt-1">
            {notification.time}
          </p>
        </div>
      )}
    </div>
  );
};
