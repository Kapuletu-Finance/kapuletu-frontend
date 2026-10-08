"use client";

import { format, subDays } from "date-fns";
import Link from "next/link";
import type React from "react";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
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
  type OpenMismatchStatus,
  type ReconciliationItem,
  usePullFlutterwaveMutation,
  useReconciliationItemsQuery,
  useReconciliationRunsQuery,
  useReconciliationSummaryQuery,
  useResolveReconciliationMutation,
  useUploadMpesaStatementMutation,
} from "@/features/admin/services/financeOpsApi";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { dateTime, EmptyRow, money, Pagination, shortDate } from "./shared";

const LIMIT = 25;

const KINDS: { value: OpenMismatchStatus; label: string; help: string }[] = [
  {
    value: "missing_in_ledger",
    label: "Money we didn't record",
    help: "The provider received it but no payment of ours succeeded. Often a lost callback: find the user and grant or extend.",
  },
  {
    value: "amount_mismatch",
    label: "Amounts differ",
    help: "Same receipt, different amount or currency. Check the provider record before refunding or charging.",
  },
  {
    value: "missing_in_statement",
    label: "Recorded, not on statement",
    help: "We marked it paid but the provider doesn't show it. Possibly a forged or reversed payment; check urgently.",
  },
];

const KIND_LABEL: Record<string, string> = {
  matched: "Matched",
  ...Object.fromEntries(KINDS.map((k) => [k.value, k.label])),
};

const PROVIDER_LABEL = { mpesa: "M-Pesa", flutterwave: "Flutterwave" };

const ResolveDialog = ({
  item,
  onClose,
}: {
  item: ReconciliationItem | null;
  onClose: () => void;
}) => {
  const resolve = useResolveReconciliationMutation();
  const [note, setNote] = useState("");
  if (!item) return null;
  const submit = (resolution: "resolved" | "ignored") =>
    resolve.mutate(
      { itemId: item.item_id, resolution, note: note.trim() },
      {
        onSuccess: () => {
          setNote("");
          onClose();
        },
      },
    );
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close this mismatch</DialogTitle>
          <DialogDescription>
            {KIND_LABEL[item.status]} · {PROVIDER_LABEL[item.provider]} {item.provider_ref}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {KINDS.find((k) => k.value === item.status)?.help}
          </p>
          <Label htmlFor="resolve-note">What did you do?</Label>
          <Textarea
            id="resolve-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Callback lost; extended Ann's Silver plan by 30 days"
            maxLength={500}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="outline"
            disabled={note.trim().length < 3 || resolve.isPending}
            onClick={() => submit("ignored")}
          >
            Ignore
          </Button>
          <Button
            disabled={note.trim().length < 3 || resolve.isPending}
            onClick={() => submit("resolved")}
          >
            Mark resolved
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Sources = () => {
  const upload = useUploadMpesaStatementMutation();
  const pull = usePullFlutterwaveMutation();
  const fileRef = useRef<HTMLInputElement>(null);
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const [from, setFrom] = useState(format(subDays(new Date(), 7), "yyyy-MM-dd"));
  const [to, setTo] = useState(yesterday);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>M-Pesa statement</CardTitle>
          <CardDescription>
            Export the paybill statement as CSV from the M-Pesa org portal and upload it.
            Re-uploading an overlapping period updates the same lines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            aria-label="M-Pesa statement CSV"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload.mutate(file);
              e.target.value = "";
            }}
          />
          <Button onClick={() => fileRef.current?.click()} disabled={upload.isPending}>
            {upload.isPending ? "Reconciling…" : "Upload statement (CSV)"}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Flutterwave</CardTitle>
          <CardDescription>
            Pulled automatically every morning for the day before. Run a range by hand here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-2">
          <div className="space-y-1">
            <Label htmlFor="flw-from">From</Label>
            <Input
              id="flw-from"
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="flw-to">To</Label>
            <Input
              id="flw-to"
              type="date"
              value={to}
              min={from}
              max={yesterday}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            disabled={pull.isPending || !from || !to}
            onClick={() => pull.mutate({ from, to })}
          >
            {pull.isPending ? "Pulling…" : "Reconcile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const ReconciliationPage: React.FC = () => {
  const { data: summary } = useReconciliationSummaryQuery();
  const { data: runs } = useReconciliationRunsQuery();
  const [status, setStatus] = useState<OpenMismatchStatus | "">("");
  const [showClosed, setShowClosed] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useReconciliationItemsQuery({
    status,
    openOnly: !showClosed,
    page,
    limit: LIMIT,
  });
  const [target, setTarget] = useState<ReconciliationItem | null>(null);
  const openTotal = summary ? Object.values(summary).reduce((a, b) => a + b, 0) : undefined;

  return (
    <PageLayout
      title="Reconciliation"
      subtitle="Compares what M-Pesa and Flutterwave say we received with the payments we recorded."
    >
      <Sources />

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            Mismatches to review
            {openTotal !== undefined && (
              <span className="text-muted-foreground"> ({openTotal})</span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            <Switch
              id="show-closed"
              checked={showClosed}
              onCheckedChange={(c) => {
                setShowClosed(c);
                setPage(1);
              }}
            />
            <Label htmlFor="show-closed">Include matched and closed</Label>
          </div>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by kind">
          <Button
            size="sm"
            variant={status === "" ? "default" : "outline"}
            aria-pressed={status === ""}
            onClick={() => {
              setStatus("");
              setPage(1);
            }}
          >
            All kinds
          </Button>
          {KINDS.map((k) => (
            <Button
              key={k.value}
              size="sm"
              variant={status === k.value ? "default" : "outline"}
              aria-pressed={status === k.value}
              title={k.help}
              onClick={() => {
                setStatus(k.value);
                setPage(1);
              }}
            >
              {k.label}
              {summary && (
                <span className="ml-1.5 tabular-nums opacity-70">{summary[k.value]}</span>
              )}
            </Button>
          ))}
        </div>

        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Provider record</TableHead>
                <TableHead>Our payment</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead className="text-right">Provider</TableHead>
                <TableHead className="text-right">Ours</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-16 w-full" />
                  </TableCell>
                </TableRow>
              ) : data?.items.length === 0 ? (
                <EmptyRow colSpan={7}>
                  {showClosed
                    ? "No reconciled lines yet. Upload a statement to start."
                    : "Nothing to review. Everything reconciles."}
                </EmptyRow>
              ) : (
                data?.items.map((i) => (
                  <TableRow key={i.item_id}>
                    <TableCell className="whitespace-nowrap">
                      {dateTime(i.provider_at ?? i.payment_at)}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">{i.provider_ref ?? "—"}</span>
                      <span className="block text-xs text-muted-foreground">
                        {PROVIDER_LABEL[i.provider]}
                        {i.counterparty && ` · ${i.counterparty}`}
                      </span>
                    </TableCell>
                    <TableCell>
                      {i.user_id ? (
                        <Link
                          href={`/admin/finance/accounts/${i.user_id}`}
                          className="hover:underline"
                        >
                          {i.user_name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">None found</span>
                      )}
                      {i.match_method === "amount_time" && (
                        <span className="block text-xs text-muted-foreground">
                          Matched by amount and time
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          i.status === "matched"
                            ? "secondary"
                            : i.status === "missing_in_statement"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {KIND_LABEL[i.status]}
                      </Badge>
                      {i.resolution && (
                        <span
                          className="block text-xs text-muted-foreground mt-1"
                          title={i.resolution_note ?? undefined}
                        >
                          {i.resolution === "resolved" ? "Resolved" : "Ignored"}{" "}
                          {shortDate(i.resolved_at)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {i.provider_amount !== null ? money(i.provider_amount) : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {i.ledger_amount !== null ? money(i.ledger_amount) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {i.status !== "matched" && !i.resolution && (
                        <Button size="sm" variant="outline" onClick={() => setTarget(i)}>
                          Close
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {data && <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent runs</h2>
        <ul className="divide-y divide-border rounded-md border border-border bg-card text-sm">
          {!runs?.items.length && (
            <li className="px-4 py-3 text-muted-foreground">No reconciliation has run yet.</li>
          )}
          {runs?.items.slice(0, 10).map((r) => (
            <li
              key={r.run_id}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5"
            >
              <span>
                {PROVIDER_LABEL[r.provider]} · {r.source === "upload" ? r.source_name : "API"}
                <span className="text-muted-foreground">
                  {" "}
                  · {shortDate(r.period_start)} to {shortDate(r.period_end)}
                </span>
              </span>
              <span className="tabular-nums">
                {r.lines} lines · {r.matched} matched ·{" "}
                <span className={r.mismatched ? "font-semibold" : ""}>
                  {r.mismatched} to review
                </span>
                <span className="text-muted-foreground"> · {dateTime(r.created_at)}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <ResolveDialog item={target} onClose={() => setTarget(null)} />
    </PageLayout>
  );
};
