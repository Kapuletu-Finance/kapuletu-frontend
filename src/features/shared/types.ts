export type Currency = "KES" | "USD" | "EUR" | "GBP";
export type GroupStatus = "active" | "archived";
export type CampaignStatus = "active" | "archived";

export interface GroupOut {
  id: string;
  name: string;
  description: string | null;
  currency: Currency;
  status: GroupStatus;
  is_active: boolean;
  created_at: string;
  slug: string | null;
  is_favorite: boolean;
  total_campaigns_count: number;
  active_campaigns_count: number;
  total_funds_raised: number;
}

export interface CampaignOut {
  id: string;
  group_id: string;
  title: string;
  description: string | null;
  target_amount: number;
  payment_instructions: string | null;
  status: CampaignStatus;
  is_active: boolean;
  created_at: string;
  slug: string | null;
  is_favorite: boolean;
  end_date: string | null;
  total_raised: number;
  progress_percentage: number;
  contributor_count: number;
  settings_override?: CampaignSettingsOverride | null;
}

export interface PaginatedGroupResponse {
  items: GroupOut[];
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
}

export interface PaginatedCampaignResponse {
  items: CampaignOut[];
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
}

export interface GroupOverview {
  group_id: string;
  name: string;
  currency: string;
  total_campaigns: number;
}

export interface CampaignSummary {
  campaign_id: string;
  title: string;
  target_amount: number;
  total_raised: number;
  progress_percentage: number;
}

export interface SubscriptionOverview {
  plan_name: string;
  status: string;
  days_left: number | null;
}

export interface WorkspaceActivity {
  log_id: string;
  action: string;
  entity_type: string;
  created_at: string;
  details?: {
    message?: string;
    [key: string]: unknown;
  };
}

export interface WorkspaceOverviewOut {
  total_groups: number;
  total_campaigns: number;
  total_members: number;
  pending_approvals: number;
  total_collected: number;
  subscription: SubscriptionOverview;
  active_groups: GroupOverview[];
  recent_activities: WorkspaceActivity[];
}

export interface PendingTransactionOut {
  pending_id: string;
  raw_message: string;
  sender_name: string | null;
  amount: number | null;
  currency: string | null;
  transaction_code: string | null;
  sender_phone: string | null;
  purpose: string | null;
  confidence_score: number;
  workflow_status: string;
  created_at: string;
}

export interface PaginatedPendingResponse {
  items: PendingTransactionOut[];
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
}

export interface RecentActivity {
  transaction_id: string;
  sender_name: string;
  amount: number;
  campaign_title: string | null;
  created_at: string;
}

export interface DailyCollection {
  date: string;
  amount: number;
}

export interface DashboardOverviewOut {
  total_collected: number;
  transaction_count: number;
  campaign_breakdown: CampaignSummary[];
  recent_activity: RecentActivity[];
  daily_collections_7_days: DailyCollection[];
}

export interface GroupCreate {
  name: string;
  description?: string | null;
  currency?: Currency;
}

export interface GroupUpdate {
  name?: string | null;
  description?: string | null;
}

export interface CampaignCreate {
  title: string;
  description?: string | null;
  target_amount?: number;
  payment_instructions?: string | null;
  end_date?: string | null;
}

export interface CampaignSettings {
  report_title?: string;
  report_footer?: string;
  blank_slots?: number;
  paid_indicator?: string;
  require_pin?: boolean;
  access_pin?: string | null;
  remove_watermark?: boolean;
  auto_send_reports?: boolean;
}

export interface CampaignUpdate {
  title?: string | null;
  description?: string | null;
  target_amount?: number | null;
  payment_instructions?: string | null;
  end_date?: string | null;
  settings?: CampaignSettings;
}

export interface TransactionOut {
  transaction_id: string;
  date: string;
  amount: number;
  name: string | null;
  payment_method: string;
}

export interface PaginatedTransactionResponse {
  items: TransactionOut[];
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
}

export interface CampaignActivity {
  log_id: string;
  action: string;
  date: string;
  details?: Record<string, unknown> | null;
}

export interface ChartDataPoint {
  date: string;
  amount: number;
}

export interface CampaignReportPreview {
  title: string;
  description: string;
  raised: number;
  target: number;
  contributors: { name: string; amount: number }[];
  payment_instructions: string | null;
  footer: string;
  public_url: string;
}

export interface CampaignSettingsOverride {
  report_title?: string;
  report_footer?: string;
  blank_slots?: number;
  paid_indicator?: string;
  require_pin?: boolean;
  access_pin?: string | null;
  remove_watermark?: boolean;
  auto_send_reports?: boolean;
}

export interface NotificationOut {
  notification_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_entity_id?: string | null;
  created_at: string;
}

export interface NotificationListOut {
  notifications: NotificationOut[];
  unread_count: number;
}

export interface PublicContributor {
  name: string;
  amount: number;
  date: string;
}

export interface PublicWebReportOut {
  campaign_title: string;
  campaign_description: string | null;
  raised_amount: number;
  target_amount: number;
  progress_percentage: number;
  total_contributors: number;
  page: number;
  total_pages: number;
  contributors: PublicContributor[];
  blank_slots_count: number;
  payment_instructions: string | null;
  remaining_message: string;
  footer_message: string | null;
  watermark: string | null;
  public_url: string;
}
