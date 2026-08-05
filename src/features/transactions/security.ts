import type { SecurityRule } from "@/features/shared/security";
import { TRANSACTIONS_URLS } from "@/features/transactions/urls";

export const transactionsSecurityRules: SecurityRule[] = [
  { allowedRoles: ["treasurer", "admin", "super_admin"], path: TRANSACTIONS_URLS.PENDING_LIST },
  { allowedRoles: ["treasurer", "admin", "super_admin"], path: TRANSACTIONS_URLS.MANUAL_ENTRY },
  { allowedRoles: ["treasurer", "admin", "super_admin"], path: TRANSACTIONS_URLS.APPROVE },
  { allowedRoles: ["treasurer", "admin", "super_admin"], path: TRANSACTIONS_URLS.REPARSE },
  { allowedRoles: ["treasurer", "admin", "super_admin"], path: TRANSACTIONS_URLS.SPLIT },
  { allowedRoles: ["treasurer", "admin", "super_admin"], path: TRANSACTIONS_URLS.BULK_APPROVE },
  { allowedRoles: ["treasurer", "admin", "super_admin"], path: /^\/transactions\/pending\/[^/]+$/ },
];
