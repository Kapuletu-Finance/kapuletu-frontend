export const GROUPS_URLS = {
  BASE_GROUPS: "/groups",
  groupDetail: (id: string) => `/groups/${id}` as const,
  groupCampaigns: (id: string) => `/groups/${id}/campaigns` as const,
  groupMembers: (id: string) => `/groups/${id}/members` as const,
} as const;
