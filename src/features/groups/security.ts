import { GROUPS_URLS } from "@/features/groups/urls";
import type { SecurityRule } from "@/features/shared/security";

export const groupsSecurityRules: SecurityRule[] = [
  { allowedRoles: ["admin"], path: GROUPS_URLS.BASE_GROUPS },
];
