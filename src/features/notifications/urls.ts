export const NOTIFICATIONS_URLS = {
  list: "/notifications" as const,
  unreadCount: "/notifications/unread-count" as const,
  markRead: (id: string) => `/notifications/${id}/read` as const,
  markAllRead: "/notifications/mark-all-read" as const,
} as const;
