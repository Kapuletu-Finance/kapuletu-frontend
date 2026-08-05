export const INBOX_URLS = {
  APPROVE: "/inbox/approve",
  BULK_APPROVE: "/inbox/bulk/approve",
  itemDetailsPath: (id: string) => `/inbox/pending/${id}`,
  MANUAL_ENTRY: "/inbox/manual",
  PENDING_LIST: "/inbox/pending",
  REPARSE: "/inbox/reparse",
  SPLIT: "/inbox/split",
} as const;
