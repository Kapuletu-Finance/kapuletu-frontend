import { INBOX_URLS } from "@/features/inbox/urls";
import type { SecurityRule } from "@/features/shared/security";

export const inboxSecurityRules: SecurityRule[] = [
  { allowedRoles: ["treasurer", "admin", "super_admin"], path: INBOX_URLS.PENDING_LIST },
  { allowedRoles: ["treasurer", "admin", "super_admin"], path: INBOX_URLS.MANUAL_ENTRY },
  { allowedRoles: ["treasurer", "admin", "super_admin"], path: INBOX_URLS.REPARSE },
  { allowedRoles: ["treasurer", "admin", "super_admin"], path: INBOX_URLS.SPLIT },
  { allowedRoles: ["treasurer", "admin", "super_admin"], path: INBOX_URLS.BULK_APPROVE },
  { allowedRoles: ["treasurer", "admin", "super_admin"], path: INBOX_URLS.BULK_REJECT },
  { allowedRoles: ["treasurer", "admin", "super_admin"], path: /^\/inbox\/[^/]+\/approve$/ },
  { allowedRoles: ["treasurer", "admin", "super_admin"], path: /^\/inbox\/[^/]+\/reject$/ },
  { allowedRoles: ["treasurer", "admin", "super_admin"], path: /^\/inbox\/pending\/[^/]+$/ },
];
