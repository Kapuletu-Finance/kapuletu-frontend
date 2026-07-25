import { CAMPAIGNS_URLS } from "@/features/campaigns/urls";
import type { SecurityRule } from "@/features/shared/security";

export const campaignsSecurityRules: SecurityRule[] = [
  { allowedRoles: ["admin", "treasurer"], path: /^\/campaigns\/[a-f0-9-]+$/ },
  { allowedRoles: ["admin", "treasurer"], path: CAMPAIGNS_URLS.campaignReports("") },
];
