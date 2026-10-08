/**
 * Hooks for the admin communications API (/admin/communications/*). Every route needs the
 * manage_communications permission.
 */
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { downloadFile } from "@/lib/download";
import { errorMessage, type Paged, toQuery } from "./financeApi";

export const COMMS_KEY = ["admin", "communications"] as const;
const BASE = "/admin/communications";

// --- types ---

export type Channel = "email" | "in_app" | "whatsapp";
export type Category = "service" | "marketing";
export type SubscriptionState = "paid" | "trial" | "comp" | "lapsed" | "free";
export type BroadcastStatus =
  | "draft"
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
  | "bounced"
  | "complained"
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

export interface Engagement {
  delivered: number;
  opened: number;
  clicked: number;
}

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
  stats: {
    audience?: ReachSummary;
    channels?: Partial<Record<Channel, ChannelCounts>>;
    /** First delivery, open (email) or read (WhatsApp), and click, per message; from provider webhooks. */
    engagement?: Partial<Record<Channel, Engagement>>;
  };
  created_by: string | null;
  approved_by: string | null;
  decision_note: string | null;
  scheduled_for: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  content?: BroadcastContent;
  /** Names for the people picker when the audience is selected_users. */
  audience_people?: RecipientSearchResult[];
}

export interface CommMessage {
  id: string;
  broadcast_id: string | null;
  broadcast_title: string | null;
  recipient: string;
  user_id: string | null;
  channel: Channel;
  destination: string;
  category: Category | "security";
  /** Transactional messages: what it was (payment_receipt, verification_code...). Null for broadcasts. */
  kind: string | null;
  subject: string | null;
  status: MessageStatus;
  attempts: number;
  error: string | null;
  next_attempt_at: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  created_at: string;
}

export interface MessageEvent {
  event: string;
  provider: string;
  detail: string | null;
  occurred_at: string;
}

export interface CommsOverview {
  period_days: number;
  broadcasts_sent: number;
  awaiting_approval: number;
  in_flight: number;
  messages: Partial<Record<Channel, ChannelCounts>>;
  suppressions: number;
  approval_threshold: number;
  deliverability: Partial<
    Record<
      "email" | "whatsapp",
      {
        attempted: number;
        delivered: number;
        opened: number;
        clicked: number;
        bounced: number;
        complained: number;
        failed: number;
      }
    >
  >;
  daily: { date: string; attempted: number; delivered: number; failed: number }[];
  /** Whether provider webhooks have reported anything in the period. */
  tracking: { email: boolean; whatsapp: boolean };
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

export type BroadcastAction =
  | "approve"
  | "reject"
  | "cancel"
  | "submit"
  | "duplicate"
  | "return-to-draft";

export const useBroadcastActionMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      action,
      note,
    }: {
      id: string;
      action: BroadcastAction;
      note?: string;
    }) =>
      (
        await apiClient.post<Broadcast>(
          `${BASE}/broadcasts/${id}/${action}`,
          action === "approve" || action === "reject" ? { note } : undefined,
        )
      ).data,
    onSuccess: (_b, { action }) => {
      qc.invalidateQueries({ queryKey: COMMS_KEY });
      toast.success(
        {
          approve: "Broadcast approved and queued.",
          reject: "Broadcast rejected.",
          cancel: "Broadcast cancelled.",
          submit: "Broadcast submitted.",
          duplicate: "Copied into a new draft.",
          "return-to-draft": "Moved back to drafts. It needs submitting again.",
        }[action],
      );
    },
    onError: (e) => toast.error(errorMessage(e, "That didn't work.")),
  });
};

/** Drafts only need a title; everything else is checked when the draft is submitted. */
export type DraftInput = Omit<BroadcastInput, "audience"> & { audience: Audience | null };

export const useSaveDraftMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, draft }: { id?: string | null; draft: DraftInput }) => {
      const body = { ...draft, audience: draft.audience ?? undefined };
      return (
        id
          ? await apiClient.put<Broadcast>(`${BASE}/broadcasts/${id}`, body)
          : await apiClient.post<Broadcast>(`${BASE}/broadcasts/drafts`, body)
      ).data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: COMMS_KEY }),
    onError: (e) => toast.error(errorMessage(e, "Could not save the draft.")),
  });
};

export const useDeleteDraftMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await apiClient.delete(`${BASE}/broadcasts/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COMMS_KEY });
      toast.success("Draft deleted.");
    },
    onError: (e) => toast.error(errorMessage(e, "Could not delete the draft.")),
  });
};

export interface TestSendResult {
  results: Partial<Record<Channel, { ok: boolean; destination: string; error: string | null }>>;
}

export const useTestSendMutation = () =>
  useMutation({
    mutationFn: async (
      input: Pick<BroadcastInput, "category" | "channels" | "content"> & { broadcast_id?: string },
    ) => (await apiClient.post<TestSendResult>(`${BASE}/broadcasts/test`, input)).data,
    onError: (e) => toast.error(errorMessage(e, "Could not send the test.")),
  });

export interface WhatsAppTemplate {
  name: string;
  language: string;
  category: string;
  body: string;
  variables: number;
  sendable: boolean;
  unsupported_reason: string | null;
}

export const useWhatsAppTemplatesQuery = (enabled: boolean) =>
  useQuery({
    queryKey: [...COMMS_KEY, "whatsapp-templates"],
    queryFn: async () =>
      (
        await apiClient.get<{ configured: boolean; templates: WhatsAppTemplate[] }>(
          `${BASE}/whatsapp/templates`,
        )
      ).data,
    enabled,
    staleTime: 5 * 60 * 1000,
  });

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
  kind?: "broadcast" | "transactional";
}) =>
  useQuery({
    queryKey: [...COMMS_KEY, "messages", params],
    queryFn: async () =>
      (await apiClient.get<Paged<CommMessage>>(`${BASE}/messages${toQuery(params)}`)).data,
    placeholderData: keepPreviousData,
  });

export const useMessageEventsQuery = (id: string | null) =>
  useQuery({
    queryKey: [...COMMS_KEY, "message", id, "events"],
    queryFn: async () =>
      (
        await apiClient.get<{ message: CommMessage; events: MessageEvent[] }>(
          `${BASE}/messages/${id}/events`,
        )
      ).data,
    enabled: !!id,
  });

export const exportDeliveryLog = (params: {
  channel?: string;
  status?: string;
  q?: string;
  broadcast_id?: string;
  kind?: "broadcast" | "transactional";
}) =>
  downloadFile(`${BASE}/messages/export${toQuery(params)}`, {
    fallbackName: `delivery-log-${new Date().toISOString().slice(0, 10)}.csv`,
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

// --- website inquiries ---

export type InquiryStatus = "unread" | "read" | "replied" | "resolved";

export interface Inquiry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  topic: string;
  message: string;
  status: InquiryStatus;
  replies: number;
  created_at: string;
  updated_at: string;
}

export interface InquiryDetail extends Inquiry {
  thread: {
    id: string;
    body: string;
    author: string;
    created_at: string;
    delivery_status: MessageStatus | null;
    message_id: string | null;
  }[];
}

export const useInquiriesQuery = (params: {
  page: number;
  limit: number;
  status?: InquiryStatus | "";
  q?: string;
}) =>
  useQuery({
    queryKey: [...COMMS_KEY, "inquiries", params],
    queryFn: async () =>
      (
        await apiClient.get<Paged<Inquiry> & { unread: number }>(
          `${BASE}/inquiries${toQuery(params)}`,
        )
      ).data,
    placeholderData: keepPreviousData,
  });

export const useInquiryQuery = (id: string | null) =>
  useQuery({
    queryKey: [...COMMS_KEY, "inquiry", id],
    queryFn: async () => (await apiClient.get<InquiryDetail>(`${BASE}/inquiries/${id}`)).data,
    enabled: !!id,
  });

export const useInquiryStatusMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: InquiryStatus }) =>
      (await apiClient.patch<InquiryDetail>(`${BASE}/inquiries/${id}`, { status })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [...COMMS_KEY] }),
    onError: (e) => toast.error(errorMessage(e, "Could not update the inquiry.")),
  });
};

export const useInquiryReplyMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body, resolve }: { id: string; body: string; resolve: boolean }) =>
      (await apiClient.post<InquiryDetail>(`${BASE}/inquiries/${id}/reply`, { body, resolve }))
        .data,
    onSuccess: (_d, { resolve }) => {
      qc.invalidateQueries({ queryKey: [...COMMS_KEY] });
      toast.success(resolve ? "Reply sent and inquiry resolved." : "Reply sent.");
    },
    onError: (e) => toast.error(errorMessage(e, "Could not send the reply.")),
  });
};
