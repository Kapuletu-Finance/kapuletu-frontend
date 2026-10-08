"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Audience,
  BroadcastStatus,
  Category,
  Channel,
  ChannelCounts,
  MessageStatus,
} from "@/features/admin/services/communicationsApi";
import { useGetMeQuery } from "@/features/auth/services/queries";

export { dateTime, EmptyRow, Pagination, shortDate, useDebouncedValue } from "../finance/shared";

// --- access ---

const FULL_ACCESS_ROLES = ["super_admin", "admin", "ceo"];

/** Mirrors the API: super admins, admins and the CEO hold every permission. */
export const useHasCommsAccess = () => {
  const { data: me, isLoading } = useGetMeQuery();
  const allowed =
    !!me &&
    (FULL_ACCESS_ROLES.includes(me.role) ||
      (me.permissions ?? []).includes("manage_communications"));
  return { allowed, isLoading, me };
};

// --- labels ---

export const CHANNEL_LABELS: Record<Channel, string> = {
  email: "Email",
  in_app: "In-app",
  whatsapp: "WhatsApp",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  service: "Service",
  marketing: "Marketing",
};

const SUBSCRIPTION_LABELS: Record<string, string> = {
  paid: "paying",
  trial: "on trial",
  comp: "on a free grant",
  lapsed: "lapsed",
  free: "on the free tier",
};

export const audienceLabel = (audience: Audience): string => {
  switch (audience.type) {
    case "all_users":
      return "Everyone";
    case "customers":
      return "All customers";
    case "staff":
      return "Staff";
    case "subscription":
      return `Customers ${audience.states.map((s) => SUBSCRIPTION_LABELS[s] ?? s).join(" or ")}`;
    case "selected_users":
      return `${audience.user_ids.length} selected ${audience.user_ids.length === 1 ? "person" : "people"}`;
    case "legacy":
      return audience.label.replaceAll("_", " ");
  }
};

// --- status badges (text always present; colour is a secondary cue) ---

const BROADCAST_STATUS: Record<
  BroadcastStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  draft: { label: "Draft", variant: "outline" },
  awaiting_approval: { label: "Awaiting approval", variant: "secondary" },
  queued: { label: "Queued", variant: "secondary" },
  sending: { label: "Sending", variant: "secondary" },
  completed: { label: "Completed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "outline" },
  rejected: { label: "Rejected", variant: "outline" },
};

export const BROADCAST_STATUSES = Object.entries(BROADCAST_STATUS).map(([value, s]) => ({
  value: value as BroadcastStatus,
  label: s.label,
}));

export const BroadcastStatusBadge = ({ status }: { status: BroadcastStatus }) => (
  <Badge variant={BROADCAST_STATUS[status].variant}>{BROADCAST_STATUS[status].label}</Badge>
);

const MESSAGE_STATUS: Record<
  MessageStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  queued: { label: "Queued", variant: "secondary" },
  sending: { label: "Sending", variant: "secondary" },
  sent: { label: "Sent", variant: "default" },
  delivered: { label: "Delivered", variant: "default" },
  failed: { label: "Failed", variant: "destructive" },
  bounced: { label: "Bounced", variant: "destructive" },
  complained: { label: "Marked as spam", variant: "destructive" },
  suppressed: { label: "Suppressed", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "outline" },
};

export const MESSAGE_STATUSES = Object.entries(MESSAGE_STATUS).map(([value, s]) => ({
  value: value as MessageStatus,
  label: s.label,
}));

export const MessageStatusBadge = ({ status }: { status: string }) => {
  const s = MESSAGE_STATUS[status as MessageStatus] ?? {
    label: status,
    variant: "outline" as const,
  };
  return <Badge variant={s.variant}>{s.label}</Badge>;
};

export const CategoryBadge = ({ category }: { category: Category }) => (
  <Badge
    variant="outline"
    className={
      category === "marketing" ? "border-violet-600/40 text-violet-700 dark:text-violet-400" : ""
    }
  >
    {CATEGORY_LABELS[category]}
  </Badge>
);

// --- delivery counts ---

export const totals = (counts: Partial<Record<Channel, ChannelCounts>> | undefined) => {
  const t = { total: 0, sent: 0, failed: 0, pending: 0, cancelled: 0 };
  for (const c of Object.values(counts ?? {})) {
    for (const [status, n] of Object.entries(c ?? {})) {
      t.total += n ?? 0;
      // A spam complaint means the message was delivered; a bounce means it wasn't
      if (status === "sent" || status === "delivered" || status === "complained") t.sent += n ?? 0;
      else if (status === "failed" || status === "bounced") t.failed += n ?? 0;
      else if (status === "queued" || status === "sending") t.pending += n ?? 0;
      else t.cancelled += n ?? 0;
    }
  }
  return t;
};

/** "1,204 of 1,250 sent · 3 failed" for a table cell. */
export const DeliverySummary = ({
  counts,
}: {
  counts: Partial<Record<Channel, ChannelCounts>> | undefined;
}) => {
  const t = totals(counts);
  if (!t.total) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="text-sm tabular-nums">
      {t.sent.toLocaleString()} of {t.total.toLocaleString()} sent
      {t.failed > 0 && (
        <span className="text-destructive"> · {t.failed.toLocaleString()} failed</span>
      )}
      {t.pending > 0 && (
        <span className="text-muted-foreground"> · {t.pending.toLocaleString()} pending</span>
      )}
    </span>
  );
};

// --- filters ---

const ALL = "all";

export type Option = { value: string; label: string };

export const FilterSelect = ({
  value,
  onChange,
  options,
  allLabel,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  allLabel: string;
  label: string;
}) => (
  <Select value={value || ALL} onValueChange={(v) => onChange(!v || v === ALL ? "" : String(v))}>
    <SelectTrigger className="sm:w-44" aria-label={label}>
      <SelectValue>
        {(v: string) => options.find((o) => o.value === v)?.label ?? allLabel}
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={ALL}>{allLabel}</SelectItem>
      {options.map((o) => (
        <SelectItem key={o.value} value={o.value}>
          {o.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export const CHANNEL_OPTIONS: Option[] = Object.entries(CHANNEL_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const pct = (part: number, whole: number) =>
  whole ? `${((part / whole) * 100).toFixed(1)}%` : "—";
