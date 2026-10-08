/**
 * Hooks for the admin communications API (/admin/communications/*). Every route needs the
 * manage_communications permission.
 */
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { errorMessage, type Paged, toQuery } from "./financeApi";

export const COMMS_KEY = ["admin", "communications"] as const;
const BASE = "/admin/communications";

// --- types ---

export type Channel = "email" | "in_app" | "whatsapp";
export type Category = "service" | "marketing";
export type SubscriptionState = "paid" | "trial" | "comp" | "lapsed" | "free";
export type BroadcastStatus =
  | "awaiting_approval"
  | "queued"
  | "sending"
  | "completed"
  | "cancelled"
  | "rejected";
export type MessageStatus =
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "failed"
  | "suppressed"
  | "cancelled";

export type Audience =
  | { type: "all_users" | "customers" | "staff" }
  | { type: "subscription"; states: SubscriptionState[] }
  | { type: "selected_users"; user_ids: string[] }
  | { type: "legacy"; label: string };

export interface BroadcastContent {
  email?: { subject: string; html: string; preheader?: string };
  in_app?: { title: string; body: string };
  whatsapp?: { template: string; language: string; params: string[] };
}

export interface BroadcastInput {
  title: string;
  category: Category;
  audience: Audience;
  channels: Channel[];
  content: BroadcastContent;
  scheduled_for?: string | null;
}

export type ChannelCounts = Partial<Record<MessageStatus, number>>;

export interface ReachSummary {
  audience_size: number;
  reachable_people: number;
  channels: Partial<
    Record<
      Channel,
      { deliverable: number; no_destination: number; no_consent: number; suppressed: number }
    >
  >;
}

export interface Broadcast {
  id: string;
  title: string;
  category: Category;
  status: BroadcastStatus;
  audience: Audience;
  channels: Channel[];
  recipients_count: number;
  stats: { audience?: ReachSummary; channels?: Partial<Record<Channel, ChannelCounts>> };
  created_by: string | null;
  approved_by: string | null;
  decision_note: string | null;
  scheduled_for: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  content?: BroadcastContent;
}

export interface CommMessage {
  id: string;
  broadcast_id: string | null;
  broadcast_title: string | null;
  recipient: string;
  user_id: string | null;
  channel: Channel;
  destination: string;
  category: Category;
  subject: string | null;
  status: MessageStatus;
  attempts: number;
  error: string | null;
  next_attempt_at: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface TransactionalLogItem {
  id: string;
  recipient: string;
  channel: string;
  destination: string;
  subject: string | null;
  status: string;
  error: string | null;
  created_at: string;
}

export interface CommsOverview {
  period_days: number;
  broadcasts_sent: number;
  awaiting_approval: number;
  in_flight: number;
  messages: Partial<Record<Channel, ChannelCounts>>;
  suppressions: number;
  approval_threshold: number;
}

export interface Suppression {
  id: string;
  channel: "email" | "whatsapp";
  destination: string;
  category: "all" | "marketing";
  reason: "unsubscribed" | "hard_bounce" | "complaint" | "manual";
  note: string | null;
  created_at: string;
}

export interface RecipientSearchResult {
  user_id: string;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  marketing_consent: boolean;
  is_active: boolean;
}

export interface EmailTemplateItem {
  id: string;
  name: string;
  version: number;
}

export interface EmailTemplateDetail {
  id: string;
  content: string;
  version: number;
  versions: {
    version: number;
    note: string | null;
    created_at: string;
    created_by: string | null;
  }[];
}

// --- overview ---

export const useCommsOverviewQuery = (days = 30) =>
  useQuery({
    queryKey: [...COMMS_KEY, "overview", days],
    queryFn: async () =>
      (await apiClient.get<CommsOverview>(`${BASE}/overview${toQuery({ days })}`)).data,
  });

// --- broadcasts ---

/** Polls while anything is still going out, so progress is live. */
const inFlight = (status?: BroadcastStatus) => status === "queued" || status === "sending";

export const useBroadcastsQuery = (params: {
  page: number;
  limit: number;
  status?: BroadcastStatus | "";
  q?: string;
}) =>
  useQuery({
    queryKey: [...COMMS_KEY, "broadcasts", params],
    queryFn: async () =>
      (await apiClient.get<Paged<Broadcast>>(`${BASE}/broadcasts${toQuery(params)}`)).data,
    placeholderData: keepPreviousData,
    refetchInterval: (query) =>
      query.state.data?.items.some((b) => inFlight(b.status)) ? 5000 : false,
  });

export const useBroadcastQuery = (id: string | null) =>
  useQuery({
    queryKey: [...COMMS_KEY, "broadcast", id],
    queryFn: async () => (await apiClient.get<Broadcast>(`${BASE}/broadcasts/${id}`)).data,
    enabled: !!id,
    refetchInterval: (query) => (inFlight(query.state.data?.status) ? 4000 : false),
  });

export const useBroadcastMessagesQuery = (
  id: string | null,
  params: { page: number; limit: number; channel?: string; status?: string; q?: string },
) =>
  useQuery({
    queryKey: [...COMMS_KEY, "broadcast", id, "messages", params],
    queryFn: async () =>
      (
        await apiClient.get<Paged<CommMessage>>(
          `${BASE}/broadcasts/${id}/messages${toQuery(params)}`,
        )
      ).data,
    enabled: !!id,
    placeholderData: keepPreviousData,
  });

export type ReachEstimate = ReachSummary & { needs_approval: boolean; approval_threshold: number };

/** Who the broadcast would reach; re-runs as the audience, category or channels change. */
export const useBroadcastEstimateQuery = (
  input: Pick<BroadcastInput, "category" | "audience" | "channels"> | null,
) =>
  useQuery({
    queryKey: [...COMMS_KEY, "estimate", input],
    queryFn: async () =>
      (await apiClient.post<ReachEstimate>(`${BASE}/broadcasts/estimate`, input)).data,
    enabled: !!input,
    placeholderData: keepPreviousData,
    retry: false,
  });

export const useCreateBroadcastMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: BroadcastInput) =>
      (await apiClient.post<Broadcast>(`${BASE}/broadcasts`, input)).data,
    onSuccess: (b) => {
      qc.invalidateQueries({ queryKey: COMMS_KEY });
      toast.success(
        b.status === "awaiting_approval"
          ? "Broadcast saved. It needs a second person to approve it before it goes out."
          : b.scheduled_for
            ? "Broadcast scheduled."
            : `Broadcast queued for ${b.recipients_count.toLocaleString()} people.`,
      );
    },
    onError: (e) => toast.error(errorMessage(e, "Could not create the broadcast.")),
  });
};

export const useBroadcastActionMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      action,
      note,
    }: {
      id: string;
      action: "approve" | "reject" | "cancel";
      note?: string;
    }) =>
      (
        await apiClient.post<Broadcast>(
          `${BASE}/broadcasts/${id}/${action}`,
          action === "cancel" ? undefined : { note },
        )
      ).data,
    onSuccess: (_b, { action }) => {
      qc.invalidateQueries({ queryKey: COMMS_KEY });
      toast.success(
        {
          approve: "Broadcast approved and queued.",
          reject: "Broadcast rejected.",
          cancel: "Broadcast cancelled.",
        }[action],
      );
    },
    onError: (e) => toast.error(errorMessage(e, "That didn't work.")),
  });
};

export const useRecipientSearchQuery = (q: string) =>
  useQuery({
    queryKey: [...COMMS_KEY, "recipients", q],
    queryFn: async () =>
      (
        await apiClient.get<RecipientSearchResult[]>(
          `${BASE}/recipients/search${toQuery({ q, limit: 20 })}`,
        )
      ).data,
    enabled: q.trim().length >= 2,
  });

// --- delivery log ---

export const useMessagesQuery = (params: {
  page: number;
  limit: number;
  channel?: string;
  status?: string;
  q?: string;
}) =>
  useQuery({
    queryKey: [...COMMS_KEY, "messages", params],
    queryFn: async () =>
      (await apiClient.get<Paged<CommMessage>>(`${BASE}/messages${toQuery(params)}`)).data,
    placeholderData: keepPreviousData,
  });

export const useTransactionalLogQuery = (params: {
  page: number;
  limit: number;
  channel?: string;
  status?: string;
  q?: string;
}) =>
  useQuery({
    queryKey: [...COMMS_KEY, "transactional", params],
    queryFn: async () =>
      (
        await apiClient.get<Paged<TransactionalLogItem>>(
          `${BASE}/transactional-log${toQuery(params)}`,
        )
      ).data,
    placeholderData: keepPreviousData,
  });

// --- suppressions ---

export const useSuppressionsQuery = (params: {
  page: number;
  limit: number;
  channel?: string;
  q?: string;
}) =>
  useQuery({
    queryKey: [...COMMS_KEY, "suppressions", params],
    queryFn: async () =>
      (await apiClient.get<Paged<Suppression>>(`${BASE}/suppressions${toQuery(params)}`)).data,
    placeholderData: keepPreviousData,
  });

export const useAddSuppressionMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      channel: "email" | "whatsapp";
      destination: string;
      category: "all" | "marketing";
      note?: string;
    }) => (await apiClient.post(`${BASE}/suppressions`, input)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...COMMS_KEY, "suppressions"] });
      toast.success("Destination blocked.");
    },
    onError: (e) => toast.error(errorMessage(e, "Could not block that destination.")),
  });
};

export const useRemoveSuppressionMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await apiClient.delete(`${BASE}/suppressions/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...COMMS_KEY, "suppressions"] });
      toast.success("Block removed.");
    },
    onError: (e) => toast.error(errorMessage(e, "Could not remove the block.")),
  });
};

// --- templates ---

export const useEmailTemplatesQuery = () =>
  useQuery({
    queryKey: [...COMMS_KEY, "templates"],
    queryFn: async () => (await apiClient.get<EmailTemplateItem[]>(`${BASE}/templates`)).data,
  });

export const useEmailTemplateQuery = (name: string | null) =>
  useQuery({
    queryKey: [...COMMS_KEY, "templates", name],
    queryFn: async () =>
      (await apiClient.get<EmailTemplateDetail>(`${BASE}/templates/${name}`)).data,
    enabled: !!name,
  });

export const useTemplatePreviewQuery = (
  name: string | null,
  content: string | null,
  message: string,
) =>
  useQuery({
    queryKey: [...COMMS_KEY, "templates", name, "preview", content, message],
    queryFn: async () =>
      (
        await apiClient.post<string>(
          `${BASE}/templates/${name}/preview`,
          { content, message: message || undefined },
          { responseType: "text" },
        )
      ).data,
    enabled: !!name,
    placeholderData: keepPreviousData,
    retry: false,
  });

export const useSaveTemplateMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, content, note }: { name: string; content: string; note?: string }) =>
      (await apiClient.put<EmailTemplateDetail>(`${BASE}/templates/${name}`, { content, note }))
        .data,
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: [...COMMS_KEY, "templates"] });
      toast.success(`Saved as version ${t.version}.`);
    },
    onError: (e) => toast.error(errorMessage(e, "Could not save the template.")),
  });
};

export const useRestoreTemplateMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, version }: { name: string; version: number }) =>
      (await apiClient.post<EmailTemplateDetail>(`${BASE}/templates/${name}/restore/${version}`))
        .data,
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: [...COMMS_KEY, "templates"] });
      toast.success(`Restored; now version ${t.version}.`);
    },
    onError: (e) => toast.error(errorMessage(e, "Could not restore that version.")),
  });
};
