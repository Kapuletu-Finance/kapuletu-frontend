import { CAMPAIGNS_URLS } from "@/features/campaigns/urls";
import type { SecurityRule } from "@/features/shared/security";

export const campaignsSecurityRules: SecurityRule[] = [
  { allowedRoles: ["admin"], path: CAMPAIGNS_URLS.LIST_CAMPAIGNS },
  { allowedRoles: ["admin"], path: CAMPAIGNS_URLS.UPDATE_CAMPAIGN },
  { allowedRoles: ["admin"], path: CAMPAIGNS_URLS.STATUS_TOGGLE },
];
