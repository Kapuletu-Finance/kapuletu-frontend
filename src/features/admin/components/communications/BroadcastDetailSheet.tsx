"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  type Broadcast,
  type Channel,
  useBroadcastActionMutation,
  useBroadcastMessagesQuery,
  useBroadcastQuery,
  useDeleteDraftMutation,
} from "@/features/admin/services/communicationsApi";
import { ChannelFunnel, MessageTimelineDialog } from "./DeliveryInsights";
import {
  audienceLabel,
  BroadcastStatusBadge,
  CategoryBadge,
  CHANNEL_LABELS,
  CHANNEL_OPTIONS,
  dateTime,
  EmptyRow,
  FilterSelect,
  MESSAGE_STATUSES,
  MessageStatusBadge,
  Pagination,
  totals,
  useDebouncedValue,
} from "./shared";

const LIMIT = 25;

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className="text-sm">{children}</dd>
  </div>
);

const DecisionDialog = ({
  broadcast,
  action,
  onClose,
}: {
  broadcast: Broadcast;
  action: "approve" | "reject" | "cancel" | null;
  onClose: () => void;
}) => {
  const mutation = useBroadcastActionMutation();
  const [note, setNote] = useState("");
  if (!action) return null;
  const copy = {
    approve: {
      title: "Approve broadcast",
      body: `It goes out to ${broadcast.recipients_count.toLocaleString()} people as soon as you approve${broadcast.scheduled_for ? ` (scheduled for ${dateTime(broadcast.scheduled_for)})` : ""}.`,
      button: "Approve and send",
    },
    reject: {
      title: "Reject broadcast",
      body: "Nothing is sent. The author can create a corrected broadcast.",
      button: "Reject",
    },
    cancel: {
      title: "Cancel broadcast",
      body: "Messages not yet sent are stopped. Messages already handed to a provider can't be recalled.",
      button: "Cancel broadcast",
    },
  }[action];
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.body}</DialogDescription>
        </DialogHeader>
        {action !== "cancel" && (
          <div className="space-y-2">
            <Label htmlFor="decision-note">Note (optional)</Label>
            <Textarea
              id="decision-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={1000}
            />
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant={action === "approve" ? "default" : "destructive"}
            disabled={mutation.isPending}
            onClick={() =>
              mutation.mutate(
                { id: broadcast.id, action, note: note.trim() || undefined },
                { onSuccess: onClose },
              )
            }
          >
            {mutation.isPending ? "Saving…" : copy.button}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Recipients = ({ id }: { id: string }) => {
  const [openMessage, setOpenMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const q = useDebouncedValue(search);
  const { data, isLoading } = useBroadcastMessagesQuery(id, {
    page,
    limit: LIMIT,
    channel,
    status,
    q,
  });

  return (
    <section className="space-y-3">
      <h3 className="font-semibold">Recipients</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Search name or address"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          aria-label="Search recipients"
        />
        <FilterSelect
          value={channel}
          onChange={(v) => {
            setChannel(v);
            setPage(1);
          }}
          options={CHANNEL_OPTIONS}
          allLabel="All channels"
          label="Channel"
        />
        <FilterSelect
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          options={MESSAGE_STATUSES}
          allLabel="All statuses"
          label="Status"
        />
      </div>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipient</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <EmptyRow colSpan={3}>Loading…</EmptyRow>
            ) : !data?.items.length ? (
              <EmptyRow colSpan={3}>No messages match.</EmptyRow>
            ) : (
              data.items.map((m) => (
                <TableRow
                  key={m.id}
                  tabIndex={0}
                  className="cursor-pointer hover:bg-muted/50 focus-visible:bg-muted/50 outline-none"
                  onClick={() => setOpenMessage(m.id)}
                  onKeyDown={(e) => e.key === "Enter" && setOpenMessage(m.id)}
                >
                  <TableCell>
                    <div className="font-medium">{m.recipient}</div>
                    {m.channel !== "in_app" && (
                      <div className="text-xs text-muted-foreground">{m.destination}</div>
                    )}
                  </TableCell>
                  <TableCell>{CHANNEL_LABELS[m.channel]}</TableCell>
                  <TableCell>
                    <MessageStatusBadge status={m.status} />
                    {m.error && (
                      <p className="text-xs text-destructive mt-1 max-w-56 break-words">
                        {m.error}
                      </p>
                    )}
                    {m.status === "queued" && m.next_attempt_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Retry {m.attempts + 1} at {dateTime(m.next_attempt_at)}
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {data && <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />}
      <MessageTimelineDialog id={openMessage} onClose={() => setOpenMessage(null)} />
    </section>
  );
};

export const BroadcastDetailSheet = ({
  id,
  onClose,
}: {
  id: string | null;
  onClose: () => void;
}) => {
  const router = useRouter();
  const { data: b, isLoading } = useBroadcastQuery(id);
  const [action, setAction] = useState<"approve" | "reject" | "cancel" | null>(null);
  const quick = useBroadcastActionMutation();
  const deleteDraft = useDeleteDraftMutation();
  const editDraft = (draftId: string) => router.push(`/admin/communications/new?draft=${draftId}`);
  const notStarted =
    b && !b.started_at && ["awaiting_approval", "queued", "rejected"].includes(b.status);
  const reach = b?.stats.audience;

  return (
    <Sheet open={!!id} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        {isLoading || !b ? (
          <div className="space-y-4 p-6">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-40" />
          </div>
        ) : (
          <div className="space-y-6 p-6">
            <SheetHeader className="p-0">
              <div className="flex flex-wrap items-center gap-2">
                <BroadcastStatusBadge status={b.status} />
                <CategoryBadge category={b.category} />
              </div>
              <SheetTitle className="text-xl">{b.title}</SheetTitle>
              <SheetDescription>
                {audienceLabel(b.audience)} · {b.channels.map((c) => CHANNEL_LABELS[c]).join(", ")}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-wrap gap-2">
              {b.status === "draft" && (
                <>
                  <Button
                    nativeButton={false}
                    render={<Link href={`/admin/communications/new?draft=${b.id}`} />}
                  >
                    Edit draft
                  </Button>
                  <Button
                    variant="outline"
                    disabled={deleteDraft.isPending}
                    onClick={() => deleteDraft.mutate(b.id, { onSuccess: onClose })}
                  >
                    Delete draft
                  </Button>
                </>
              )}
              {b.status === "awaiting_approval" && (
                <>
                  <Button onClick={() => setAction("approve")}>Approve</Button>
                  <Button variant="outline" onClick={() => setAction("reject")}>
                    Reject
                  </Button>
                </>
              )}
              {notStarted && (
                <Button
                  variant="outline"
                  disabled={quick.isPending}
                  onClick={() =>
                    quick.mutate(
                      { id: b.id, action: "return-to-draft" },
                      { onSuccess: () => editDraft(b.id) },
                    )
                  }
                >
                  Return to draft
                </Button>
              )}
              {(b.status === "awaiting_approval" ||
                b.status === "queued" ||
                b.status === "sending") && (
                <Button variant="outline" onClick={() => setAction("cancel")}>
                  Cancel broadcast
                </Button>
              )}
              {b.status !== "draft" && (
                <Button
                  variant="outline"
                  disabled={quick.isPending}
                  onClick={() =>
                    quick.mutate(
                      { id: b.id, action: "duplicate" },
                      { onSuccess: (copy) => editDraft(copy.id) },
                    )
                  }
                >
                  Duplicate
                </Button>
              )}
            </div>
            {b.status === "awaiting_approval" && (
              <p className="text-xs text-muted-foreground">
                Returning to draft lets the author edit it; it then needs approving again.
              </p>
            )}

            <dl className="grid grid-cols-2 gap-4">
              <Field label="Created">
                {dateTime(b.created_at)} by {b.created_by ?? "—"}
              </Field>
              {b.approved_by && (
                <Field label={b.status === "rejected" ? "Rejected by" : "Approved by"}>
                  {b.approved_by}
                  {b.decision_note && (
                    <span className="block text-xs text-muted-foreground">“{b.decision_note}”</span>
                  )}
                </Field>
              )}
              {b.scheduled_for && <Field label="Scheduled for">{dateTime(b.scheduled_for)}</Field>}
              <Field label="Started">{dateTime(b.started_at)}</Field>
              <Field label="Finished">{dateTime(b.completed_at)}</Field>
              <Field label="People reached">{b.recipients_count.toLocaleString()}</Field>
            </dl>

            {b.status !== "draft" && (
              <section className="space-y-3">
                <h3 className="font-semibold">Delivery</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {b.channels.map((channel: Channel) => {
                    const t = totals({ [channel]: b.stats.channels?.[channel] });
                    const skipped = reach?.channels?.[channel];
                    return (
                      <div key={channel} className="rounded-md border border-border p-3 space-y-1">
                        <p className="text-sm font-medium">{CHANNEL_LABELS[channel]}</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {t.sent.toLocaleString()}
                          <span className="text-sm font-normal text-muted-foreground">
                            {" "}
                            / {t.total.toLocaleString()} sent
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {t.failed > 0 && <Badge variant="destructive">{t.failed} failed</Badge>}
                          {t.pending > 0 && <Badge variant="secondary">{t.pending} pending</Badge>}
                          {t.cancelled > 0 && (
                            <Badge variant="outline">{t.cancelled} stopped</Badge>
                          )}
                        </div>
                        <ChannelFunnel
                          channel={channel}
                          sent={t.sent + t.failed}
                          engagement={b.stats.engagement?.[channel]}
                        />
                        {skipped &&
                          skipped.no_consent + skipped.suppressed + skipped.no_destination > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Not sent: {skipped.no_consent} without marketing consent,{" "}
                              {skipped.suppressed} suppressed, {skipped.no_destination} with no
                              address
                            </p>
                          )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {b.content?.email && (
              <section className="space-y-2">
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm">
                  <span className="text-muted-foreground">Subject: </span>
                  {b.content.email.subject}
                </p>
                <iframe
                  title="Email content"
                  sandbox=""
                  srcDoc={b.content.email.html}
                  className="w-full h-64 rounded-md border border-border bg-white"
                />
              </section>
            )}
            {b.content?.whatsapp && (
              <section className="space-y-1">
                <h3 className="font-semibold">WhatsApp</h3>
                <p className="text-sm">
                  Template <code>{b.content.whatsapp.template}</code> ({b.content.whatsapp.language}
                  )
                  {b.content.whatsapp.params.length > 0 &&
                    ` with ${b.content.whatsapp.params.map((p, i) => `{{${i + 1}}} = “${p}”`).join(", ")}`}
                </p>
              </section>
            )}

            {b.status !== "draft" && <Recipients id={b.id} />}
            <DecisionDialog broadcast={b} action={action} onClose={() => setAction(null)} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
