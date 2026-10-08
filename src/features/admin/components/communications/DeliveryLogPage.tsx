"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
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
  useMessagesQuery,
  useTransactionalLogQuery,
} from "@/features/admin/services/communicationsApi";
import { PageLayout } from "@/features/shared/components/PageLayout";
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

type Filters = { page: number; limit: number; channel: string; status: string; q: string };

const BroadcastMessages = ({
  filters,
  onPage,
}: {
  filters: Filters;
  onPage: (p: number) => void;
}) => {
  const { data, isLoading } = useMessagesQuery(filters);
  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipient</TableHead>
              <TableHead>Broadcast</TableHead>
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
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="font-medium">{m.recipient}</div>
                    {m.channel !== "in_app" && (
                      <div className="text-xs text-muted-foreground">{m.destination}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {m.broadcast_id ? (
                      <Link
                        href={`/admin/communications/broadcasts?open=${m.broadcast_id}`}
                        className="text-primary hover:underline"
                      >
                        {m.broadcast_title}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{CHANNEL_LABELS[m.channel]}</TableCell>
                  <TableCell>
                    <MessageStatusBadge status={m.status} />
                    {m.error && (
                      <p className="text-xs text-destructive mt-1 max-w-64 break-words">
                        {m.error}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {dateTime(m.sent_at ?? m.created_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {data && <Pagination page={filters.page} limit={LIMIT} total={data.total} onPage={onPage} />}
    </>
  );
};

const TransactionalMessages = ({
  filters,
  onPage,
}: {
  filters: Filters;
  onPage: (p: number) => void;
}) => {
  const { data, isLoading } = useTransactionalLogQuery(filters);
  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipient</TableHead>
              <TableHead>Subject</TableHead>
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
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="font-medium">{m.recipient}</div>
                    <div className="text-xs text-muted-foreground">{m.destination}</div>
                  </TableCell>
                  <TableCell className="text-sm">{m.subject ?? "—"}</TableCell>
                  <TableCell>
                    {CHANNEL_LABELS[m.channel as keyof typeof CHANNEL_LABELS] ?? m.channel}
                  </TableCell>
                  <TableCell>
                    <MessageStatusBadge status={m.status} />
                    {m.error && (
                      <p className="text-xs text-destructive mt-1 max-w-64 break-words">
                        {m.error}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {dateTime(m.created_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {data && <Pagination page={filters.page} limit={LIMIT} total={data.total} onPage={onPage} />}
    </>
  );
};

export const DeliveryLogPage: React.FC = () => {
  const [view, setView] = useState<"broadcast" | "transactional">("broadcast");
  const [page, setPage] = useState(1);
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const q = useDebouncedValue(search);
  const filters = { page, limit: LIMIT, channel, status, q };
  const reset =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v);
      setPage(1);
    };

  return (
    <PageLayout
      title="Delivery log"
      subtitle="Every message and what happened to it. Failed messages show the provider's reason; rate-limited ones are retried automatically."
      controls={
        <div className="flex flex-col gap-3">
          <div className="flex gap-2" role="group" aria-label="Message type">
            <Button
              size="sm"
              variant={view === "broadcast" ? "default" : "outline"}
              aria-pressed={view === "broadcast"}
              onClick={() => reset(setView)("broadcast")}
            >
              Broadcasts
            </Button>
            <Button
              size="sm"
              variant={view === "transactional" ? "default" : "outline"}
              aria-pressed={view === "transactional"}
              onClick={() => reset(setView)("transactional")}
            >
              Transactional (OTPs, receipts, invites)
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder={
                view === "broadcast"
                  ? "Search name, address or subject"
                  : "Search address or subject"
              }
              value={search}
              onChange={(e) => reset(setSearch)(e.target.value)}
              className="sm:max-w-xs"
              aria-label="Search messages"
            />
            <FilterSelect
              value={channel}
              onChange={reset(setChannel)}
              options={
                view === "broadcast"
                  ? CHANNEL_OPTIONS
                  : CHANNEL_OPTIONS.filter((o) => o.value !== "in_app")
              }
              allLabel="All channels"
              label="Channel"
            />
            <FilterSelect
              value={status}
              onChange={reset(setStatus)}
              options={
                view === "broadcast"
                  ? MESSAGE_STATUSES
                  : MESSAGE_STATUSES.filter((s) => ["queued", "sent", "failed"].includes(s.value))
              }
              allLabel="All statuses"
              label="Status"
            />
          </div>
        </div>
      }
    >
      {view === "broadcast" ? (
        <BroadcastMessages filters={filters} onPage={setPage} />
      ) : (
        <TransactionalMessages filters={filters} onPage={setPage} />
      )}
    </PageLayout>
  );
};
