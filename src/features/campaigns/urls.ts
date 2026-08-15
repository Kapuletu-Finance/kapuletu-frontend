export const CAMPAIGNS_URLS = {
  campaignDetail: (id: string) => `/campaigns/${id}` as const,
  publicCampaignVerify: (shortCode: string) => `/public/campaigns/${shortCode}/verify` as const,
  campaignFavorite: (id: string) => `/campaigns/${id}/favorite` as const,
  campaignInbox: (id: string) => `/campaigns/${id}/inbox` as const,
  campaignTransactions: (id: string) => `/campaigns/${id}/transactions` as const,
  campaignActivities: (id: string) => `/campaigns/${id}/activities` as const,
  campaignChartData: (id: string) => `/campaigns/${id}/chart-data` as const,
  campaignReportPreview: (id: string) => `/campaigns/${id}/report-preview` as const,
  campaignRegeneratePin: (id: string) => `/campaigns/${id}/regenerate-pin` as const,
  campaignExportExcel: (id: string) => `/campaigns/${id}/export/excel` as const,
  campaignExportPdf: (id: string) => `/campaigns/${id}/export/pdf` as const,
  campaignReports: (id: string) => `/reports/whatsapp/${id}` as const,
} as const;
