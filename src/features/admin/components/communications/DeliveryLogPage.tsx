"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type CommMessage,
  exportDeliveryLog,
  useMessagesQuery,
} from "@/features/admin/services/communicationsApi";
import { errorMessage } from "@/features/admin/services/financeApi";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { MessageTimelineDialog } from "./DeliveryInsights";
import {
  CHANNEL_LABELS,
  CHANNEL_OPTIONS,
  dateTime,
  EmptyRow,
  FilterSelect,
  MESSAGE_STATUSES,
  MessageStatusBadge,
  Pagination,
  useDebouncedValue,
} from "./shared";

const LIMIT = 50;

type Kind = "broadcast" | "transactional";

/** What each transactional message is, in words; unknown kinds fall back to a tidied code. */
const KIND_LABELS: Record<string, string> = {
  payment_receipt: "Payment receipt",
  trial_started: "Trial started",
  subscription_reminder: "Renewal reminder",
  verification_code: "Verification code",
  password_changed: "Password changed",
  platform_invite: "Platform invite",
  employee_invite: "Staff invite",
  meeting_notice: "Meeting notice",
  finance_report: "Finance report",
  support_ticket_received: "Ticket received",
  support_reply: "Support reply",
  inquiry_reply: "Inquiry reply",
  contact_acknowledgement: "Contact form receipt",
  legacy: "Before the outbox",
};

const kindLabel = (kind: string | null) => {
  if (!kind) return "—";
  if (KIND_LABELS[kind]) return KIND_LABELS[kind];
  if (kind.startsWith("staff_alert")) return `Staff alert (${kind.replace("staff_alert_", "")})`;
  return kind.replaceAll("_", " ");
};

const STATUS_OPTIONS = [
  ...MESSAGE_STATUSES,
  { value: "opened", label: "Opened or read" },
  { value: "clicked", label: "Clicked" },
];

const MessageRow = ({ m, kind, onOpen }: { m: CommMessage; kind: Kind; onOpen: () => void }) => (
  <TableRow
    tabIndex={0}
    className="cursor-pointer hover:bg-muted/50 focus-visible:bg-muted/50 outline-none"
    onClick={onOpen}
    onKeyDown={(e) => e.key === "Enter" && onOpen()}
  >
    <TableCell>
      <div className="font-medium">{m.recipient}</div>
      {m.channel !== "in_app" && (
        <div className="text-xs text-muted-foreground">{m.destination}</div>
      )}
    </TableCell>
    <TableCell className="text-sm">
      {kind === "broadcast" ? (
        m.broadcast_id ? (
          <Link
            href={`/admin/communications/broadcasts?open=${m.broadcast_id}`}
            className="text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {m.broadcast_title}
          </Link>
        ) : (
          "—"
        )
      ) : (
        <>
          <div>{kindLabel(m.kind)}</div>
          {m.subject && (
            <div className="text-xs text-muted-foreground truncate max-w-64">{m.subject}</div>
          )}
        </>
      )}
    </TableCell>
    <TableCell>
      {CHANNEL_LABELS[m.channel as keyof typeof CHANNEL_LABELS] ?? m.channel.toUpperCase()}
    </TableCell>
    <TableCell>
      <MessageStatusBadge status={m.status} />
      {(m.opened_at || m.clicked_at) && (
        <span className="ml-2 text-xs text-muted-foreground">
          {m.clicked_at ? "Clicked" : m.channel === "whatsapp" ? "Read" : "Opened"}
        </span>
      )}
      {m.error && <p className="text-xs text-destructive mt-1 max-w-64 break-words">{m.error}</p>}
    </TableCell>
    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
      {dateTime(m.sent_at ?? m.created_at)}
    </TableCell>
  </TableRow>
);

export const DeliveryLogPage: React.FC = () => {
  const [kind, setKind] = useState<Kind>("broadcast");
  const [page, setPage] = useState(1);
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);
  const [openMessage, setOpenMessage] = useState<string | null>(null);
  const q = useDebouncedValue(search);
  const { data, isLoading } = useMessagesQuery({ page, limit: LIMIT, channel, status, q, kind });

  const reset =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v);
      setPage(1);
    };

  const exportCsv = async () => {
    setExporting(true);
    try {
      await exportDeliveryLog({ channel, status, q, kind });
    } catch (e) {
      toast.error(errorMessage(e, "Could not export the delivery log."));
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageLayout
      title="Delivery log"
      subtitle="Every message we send and what happened to it. Click a message for its full history; rate-limited sends are retried automatically."
      controls={
        <div className="flex flex-col gap-3">
          <div className="flex gap-2" role="group" aria-label="Message type">
            <Button
              size="sm"
              variant={kind === "broadcast" ? "default" : "outline"}
              aria-pressed={kind === "broadcast"}
              onClick={() => reset(setKind)("broadcast")}
            >
              Broadcasts
            </Button>
            <Button
              size="sm"
              variant={kind === "transactional" ? "default" : "outline"}
              aria-pressed={kind === "transactional"}
              onClick={() => reset(setKind)("transactional")}
            >
              Transactional (receipts, codes, invites, alerts)
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Search name, address or subject"
              value={search}
              onChange={(e) => reset(setSearch)(e.target.value)}
              className="sm:max-w-xs"
              aria-label="Search messages"
            />
            <FilterSelect
              value={channel}
              onChange={reset(setChannel)}
              options={
                kind === "broadcast"
                  ? CHANNEL_OPTIONS
                  : [
                      ...CHANNEL_OPTIONS.filter((o) => o.value !== "in_app"),
                      { value: "sms", label: "SMS" },
                    ]
              }
              allLabel="All channels"
              label="Channel"
            />
            <FilterSelect
              value={status}
              onChange={reset(setStatus)}
              options={STATUS_OPTIONS}
              allLabel="All statuses"
              label="Status"
            />
            <Button
              variant="outline"
              className="sm:ml-auto"
              disabled={exporting}
              onClick={exportCsv}
            >
              {exporting ? "Exporting…" : "Export CSV"}
            </Button>
          </div>
        </div>
      }
      pagination={
        data && <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />
      }
    >
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipient</TableHead>
              <TableHead>{kind === "broadcast" ? "Broadcast" : "Message"}</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <EmptyRow colSpan={5}>Loading…</EmptyRow>
            ) : !data?.items.length ? (
              <EmptyRow colSpan={5}>No messages match.</EmptyRow>
            ) : (
              data.items.map((m) => (
                <MessageRow key={m.id} m={m} kind={kind} onOpen={() => setOpenMessage(m.id)} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <MessageTimelineDialog id={openMessage} onClose={() => setOpenMessage(null)} />
    </PageLayout>
  );
};
