export const TRANSACTIONS_URLS = {
  APPROVE: "/transactions/approve",
  BULK_APPROVE: "/transactions/bulk/approve",
  itemDetailsPath: (id: string) => `/transactions/pending/${id}`,
  MANUAL_ENTRY: "/transactions/manual",
  PENDING_LIST: "/transactions/pending",
  REPARSE: "/transactions/reparse",
  SPLIT: "/transactions/split",
} as const;
