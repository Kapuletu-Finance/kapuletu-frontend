export const INBOX_URLS = {
  BULK_APPROVE: "/inbox/bulk/approve",
  BULK_REJECT: "/inbox/bulk/reject",
  itemDetailsPath: (id: string) => `/inbox/pending/${id}`,
  MANUAL_ENTRY: "/inbox/manual",
  PENDING_LIST: "/inbox/pending",
  approve: (id: string) => `/inbox/${id}/approve`,
  reject: (id: string) => `/inbox/${id}/reject`,
  REPARSE: "/inbox/reparse",
  SPLIT: "/inbox/split",
} as const;
