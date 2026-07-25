export const CAMPAIGNS_URLS = {
  campaignDetail: (id: string) => `/campaigns/${id}` as const,
  campaignReports: (id: string) => `/reports/whatsapp/${id}` as const,
} as const;
