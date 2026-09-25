export const GROUPS_URLS = {
  BASE_GROUPS: "/groups",
  groupDetail: (id: string) => `/groups/${id}` as const,
  groupFavorite: (id: string) => `/groups/${id}/favorite` as const,
  groupCampaigns: (id: string) => `/groups/${id}/campaigns` as const,
  groupMembers: (id: string) => `/groups/${id}/members` as const,
  groupPermanentDelete: (id: string) => `/groups/${id}/permanent` as const,
  groupHistory: (id: string) => `/audit/logs/group/${id}` as const,
  groupCoverPhoto: (id: string) => `/groups/${id}/cover-photo` as const,
} as const;
