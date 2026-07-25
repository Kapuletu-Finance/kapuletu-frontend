import { GROUPS_URLS } from "@/features/groups/urls";
import type { SecurityRule } from "@/features/shared/security";

export const groupsSecurityRules: SecurityRule[] = [
  { allowedRoles: ["admin", "treasurer"], path: GROUPS_URLS.BASE_GROUPS },
  { allowedRoles: ["admin", "treasurer"], path: /^\/groups\/[a-f0-9-]+$/ },
  { allowedRoles: ["admin", "treasurer"], path: /^\/groups\/[a-f0-9-]+\/campaigns$/ },
  { allowedRoles: ["admin", "treasurer"], path: /^\/groups\/[a-f0-9-]+\/members$/ },
];
