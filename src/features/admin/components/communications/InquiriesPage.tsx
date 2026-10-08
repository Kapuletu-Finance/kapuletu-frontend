"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  type InquiryStatus,
  useInquiriesQuery,
  useInquiryQuery,
  useInquiryReplyMutation,
  useInquiryStatusMutation,
} from "@/features/admin/services/communicationsApi";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { MessageTimelineDialog } from "./DeliveryInsights";
import { dateTime, EmptyRow, MessageStatusBadge, Pagination, useDebouncedValue } from "./shared";

const LIMIT = 25;

const STATUS: Record<
  InquiryStatus,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  unread: { label: "New", variant: "default" },
  read: { label: "Read", variant: "secondary" },
  replied: { label: "Replied", variant: "secondary" },
  resolved: { label: "Resolved", variant: "outline" },
};

const TABS: { value: InquiryStatus | ""; label: string }[] = [
  { value: "unread", label: "New" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
  { value: "resolved", label: "Resolved" },
  { value: "", label: "All" },
];

const InquirySheet = ({ id, onClose }: { id: string | null; onClose: () => void }) => {
  const { data, isLoading } = useInquiryQuery(id);
  const setStatus = useInquiryStatusMutation();
  const reply = useInquiryReplyMutation();
  const [body, setBody] = useState("");
  const [openMessage, setOpenMessage] = useState<string | null>(null);

  // Opening a new inquiry marks it read
  useEffect(() => {
    if (data?.status === "unread") setStatus.mutate({ id: data.id, status: "read" });
  }, [data?.id, data?.status, setStatus.mutate]);

  const send = (resolve: boolean) =>
    data && reply.mutate({ id: data.id, body, resolve }, { onSuccess: () => setBody("") });

  return (
    <Sheet open={!!id} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        {isLoading || !data ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-32" />
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <SheetHeader className="p-0">
              <Badge variant={STATUS[data.status].variant} className="w-fit">
                {STATUS[data.status].label}
              </Badge>
              <SheetTitle className="text-xl">{data.topic}</SheetTitle>
              <SheetDescription>
                {data.first_name} {data.last_name} · {data.email} · {dateTime(data.created_at)}
              </SheetDescription>
            </SheetHeader>

            <p className="text-sm whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-4">
              {data.message}
            </p>

            {data.thread.length > 0 && (
              <ol className="space-y-3" aria-label="Replies">
                {data.thread.map((r) => (
                  <li key={r.id} className="rounded-lg border border-border p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span>
                        {r.author} · {dateTime(r.created_at)}
                      </span>
                      {r.delivery_status && r.message_id && (
                        <button
                          type="button"
                          onClick={() => setOpenMessage(r.message_id)}
                          aria-label="Delivery history"
                        >
                          <MessageStatusBadge status={r.delivery_status} />
                        </button>
                      )}
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{r.body}</p>
                  </li>
                ))}
              </ol>
            )}

            <section className="space-y-2">
              <Label htmlFor="inquiry-reply">Reply to {data.first_name}</Label>
              <Textarea
                id="inquiry-reply"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                maxLength={10000}
                placeholder="Your reply is emailed from KapuLetu Support with their message quoted below it."
              />
              <div className="flex flex-wrap gap-2">
                <Button disabled={!body.trim() || reply.isPending} onClick={() => send(false)}>
                  {reply.isPending ? "Sending…" : "Send reply"}
                </Button>
                <Button
                  variant="outline"
                  disabled={!body.trim() || reply.isPending}
                  onClick={() => send(true)}
                >
                  Send and resolve
                </Button>
                {data.status !== "resolved" ? (
                  <Button
                    variant="ghost"
                    disabled={setStatus.isPending}
                    onClick={() => setStatus.mutate({ id: data.id, status: "resolved" })}
                  >
                    Resolve without replying
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    disabled={setStatus.isPending}
                    onClick={() => setStatus.mutate({ id: data.id, status: "read" })}
                  >
                    Reopen
                  </Button>
                )}
              </div>
            </section>
            <MessageTimelineDialog id={openMessage} onClose={() => setOpenMessage(null)} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export const InquiriesPage: React.FC = () => {
  const [status, setStatus] = useState<InquiryStatus | "">("unread");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const q = useDebouncedValue(search);
  const { data, isLoading } = useInquiriesQuery({ page, limit: LIMIT, status, q });

  return (
    <PageLayout
      title="Inquiries"
      subtitle="Messages from the contact form on the public website. Replies are emailed and tracked in the delivery log."
      controls={
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
            {TABS.map((t) => (
              <Button
                key={t.label}
                size="sm"
                variant={status === t.value ? "default" : "outline"}
                aria-pressed={status === t.value}
                onClick={() => {
                  setStatus(t.value);
                  setPage(1);
                }}
              >
                {t.label}
                {t.value === "unread" && data?.unread ? ` (${data.unread})` : ""}
              </Button>
            ))}
          </div>
          <Input
            placeholder="Search name, email, topic or text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="sm:max-w-xs sm:ml-auto"
            aria-label="Search inquiries"
          />
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
              <TableHead>From</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <EmptyRow colSpan={4}>Loading…</EmptyRow>
            ) : !data?.items.length ? (
              <EmptyRow colSpan={4}>
                {status === "unread" && !q ? "No new inquiries." : "No inquiries match."}
              </EmptyRow>
            ) : (
              data.items.map((m) => (
                <TableRow
                  key={m.id}
                  tabIndex={0}
                  className="cursor-pointer hover:bg-muted/50 focus-visible:bg-muted/50 outline-none"
                  onClick={() => setOpenId(m.id)}
                  onKeyDown={(e) => e.key === "Enter" && setOpenId(m.id)}
                >
                  <TableCell>
                    <div className={m.status === "unread" ? "font-semibold" : "font-medium"}>
                      {m.first_name} {m.last_name}
                    </div>
                    <div className="text-xs text-muted-foreground">{m.email}</div>
                  </TableCell>
                  <TableCell className="text-sm max-w-md">
                    <div className="font-medium">{m.topic}</div>
                    <div className="text-xs text-muted-foreground truncate">{m.message}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS[m.status].variant}>{STATUS[m.status].label}</Badge>
                    {m.replies > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {m.replies} {m.replies === 1 ? "reply" : "replies"}
                      </span>
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
      <InquirySheet id={openId} onClose={() => setOpenId(null)} />
    </PageLayout>
  );
};
