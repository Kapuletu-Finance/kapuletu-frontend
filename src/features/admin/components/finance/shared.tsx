"use client";

import { format, parseISO, startOfMonth, startOfYear, subDays, subMonths } from "date-fns";
import type React from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  FinanceInvoice,
  RefundStatus,
  SubscriptionState,
} from "@/features/admin/services/financeApi";
import { useGetMeQuery } from "@/features/auth/services/queries";
import { formatKes } from "@/lib/utils";

// --- formatting ---

export const money = (amount: number | null | undefined) => formatKes(amount ?? 0);

export const shortDate = (iso: string | null | undefined) =>
  iso ? format(parseISO(iso), "d MMM yyyy") : "—";

export const dateTime = (iso: string | null | undefined) =>
  iso ? format(parseISO(iso), "d MMM yyyy, HH:mm") : "—";

// --- access ---

const FULL_ACCESS_ROLES = ["super_admin", "admin", "ceo"];

/** Mirrors the API: super admins, admins and the CEO hold every permission. */
export const useHasFinanceAccess = () => {
  const { data: me, isLoading } = useGetMeQuery();
  const allowed =
    !!me &&
    (FULL_ACCESS_ROLES.includes(me.role) || (me.permissions ?? []).includes("manage_finance"));
  return { allowed, isLoading, me };
};

// --- status badges (text always present; colour is a secondary cue) ---

const STATE_STYLES: Record<SubscriptionState, { label: string; className: string }> = {
  paid: {
    label: "Paid",
    className: "border-emerald-600/40 text-emerald-700 dark:text-emerald-400",
  },
  trial: { label: "Trial", className: "border-sky-600/40 text-sky-700 dark:text-sky-400" },
  comp: {
    label: "Free grant",
    className: "border-violet-600/40 text-violet-700 dark:text-violet-400",
  },
  lapsed: {
    label: "Lapsed (grace)",
    className: "border-amber-600/40 text-amber-700 dark:text-amber-400",
  },
  free: { label: "Free tier", className: "text-muted-foreground" },
};

export const SUBSCRIPTION_STATES = Object.entries(STATE_STYLES).map(([value, s]) => ({
  value: value as SubscriptionState,
  label: s.label,
}));

export const StateBadge = ({ state }: { state: SubscriptionState }) => (
  <Badge variant="outline" className={STATE_STYLES[state].className}>
    {STATE_STYLES[state].label}
  </Badge>
);

export const PaymentStatusBadge = ({
  status,
  type,
  refunded,
}: {
  status: string;
  type?: string;
  refunded?: boolean;
}) => {
  if (type === "refund") return <Badge variant="outline">Refund</Badge>;
  if (type === "comp") return <Badge variant="outline">Free grant</Badge>;
  if (refunded) return <Badge variant="secondary">Refunded</Badge>;
  if (status === "success") return <Badge>Paid</Badge>;
  if (status === "failed") return <Badge variant="destructive">Failed</Badge>;
  return <Badge variant="secondary">Pending</Badge>;
};

export const InvoiceStatusBadge = ({ status }: { status: FinanceInvoice["status"] }) => {
  const variant = {
    paid: "default",
    open: "secondary",
    void: "outline",
    draft: "outline",
  } as const;
  const label = { paid: "Paid", open: "Awaiting payment", void: "Void", draft: "Draft" };
  return <Badge variant={variant[status]}>{label[status]}</Badge>;
};

export const RefundStatusBadge = ({ status }: { status: RefundStatus }) => {
  const variant = {
    requested: "secondary",
    approved: "default",
    paid: "default",
    rejected: "outline",
  } as const;
  const label = {
    requested: "Awaiting approval",
    approved: "Approved",
    paid: "Paid out",
    rejected: "Rejected",
  };
  return <Badge variant={variant[status]}>{label[status]}</Badge>;
};

export const METHOD_LABELS: Record<string, string> = {
  mpesa: "M-Pesa",
  flutterwave: "Card (Flutterwave)",
  stripe: "Card",
  gateway: "Gateway",
  admin_override: "Admin grant",
  admin_refund: "Refund",
};

// --- lists ---

export const Pagination = ({
  page,
  limit,
  total,
  onPage,
}: {
  page: number;
  limit: number;
  total: number;
  onPage: (page: number) => void;
}) => {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (total <= limit) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        {total} {total === 1 ? "result" : "results"}
      </p>
    );
  }
  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <p className="text-sm text-muted-foreground">
        {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onPage(page - 1)} disabled={page <= 1}>
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {pages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPage(page + 1)}
          disabled={page >= pages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export const useDebouncedValue = <T,>(value: T, delay = 350): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};

export const EmptyRow = ({ colSpan, children }: { colSpan: number; children: React.ReactNode }) => (
  <tr>
    <td colSpan={colSpan} className="h-24 text-center text-sm text-muted-foreground">
      {children}
    </td>
  </tr>
);

// --- date ranges ---

export type RangePreset = "7d" | "30d" | "90d" | "mtd" | "last_month" | "ytd" | "12m";

export const RANGE_PRESETS: { value: RangePreset; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "mtd", label: "This month" },
  { value: "last_month", label: "Last month" },
  { value: "ytd", label: "Year to date" },
  { value: "12m", label: "Last 12 months" },
];

export const toUtcNaive = (d: Date) => d.toISOString().slice(0, 19);

/** ISO bounds for a preset; `to` is left open (now) for ranges that end today. */
export const presetRange = (
  preset: RangePreset,
  now = new Date(),
): { from: string; to?: string } => {
  // Local midnight, sent as naive UTC (how the API stores times).
  const iso = (d: Date) => toUtcNaive(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  switch (preset) {
    case "7d":
      return { from: iso(subDays(now, 7)) };
    case "90d":
      return { from: iso(subDays(now, 90)) };
    case "mtd":
      return { from: iso(startOfMonth(now)) };
    case "last_month":
      return { from: iso(startOfMonth(subMonths(now, 1))), to: iso(startOfMonth(now)) };
    case "ytd":
      return { from: iso(startOfYear(now)) };
    case "12m":
      return { from: iso(subMonths(now, 12)) };
    default:
      return { from: iso(subDays(now, 30)) };
  }
};
