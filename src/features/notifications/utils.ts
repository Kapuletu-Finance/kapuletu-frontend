import type { DisplayNotification } from "@/features/notifications/components/NotificationItem";
import type { IconName } from "@/features/shared/components/IconLibrary";
import type { NotificationOut } from "@/features/shared/types";

export function timeAgo(dateString: string): string {
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

export function notificationToDisplay(n: NotificationOut): DisplayNotification {
  const typeIconMap: Record<
    string,
    { icon: IconName; iconClassName: string; iconBgClassName: string }
  > = {
    inbox_approved: {
      icon: "inbox",
      iconClassName: "text-primary",
      iconBgClassName: "bg-primary/10 dark:bg-primary/30",
    },
    inbox_rejected: {
      icon: "inbox",
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
