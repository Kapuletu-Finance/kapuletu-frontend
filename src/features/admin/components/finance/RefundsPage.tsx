"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  type FinanceRefund,
  REFUND_REASONS,
  type RefundStatus,
  useDecideRefundMutation,
  useFinanceRefundsQuery,
} from "@/features/admin/services/financeApi";
import { PageLayout } from "@/features/shared/components/PageLayout";
import {
  dateTime,
  EmptyRow,
  money,
  Pagination,
  RefundStatusBadge,
  useHasFinanceAccess,
} from "./shared";

const LIMIT = 25;

const TABS: { value: RefundStatus | ""; label: string }[] = [
  { value: "requested", label: "Awaiting approval" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "", label: "All" },
];

const reasonLabel = (code: string) => REFUND_REASONS.find((r) => r.value === code)?.label ?? code;

const DecisionDialog = ({
  refund,
  decision,
  onClose,
}: {
  refund: FinanceRefund | null;
  decision: "approve" | "reject" | null;
  onClose: () => void;
}) => {
  const mutation = useDecideRefundMutation();
  const [note, setNote] = useState("");
  if (!refund || !decision) return null;
  const approve = decision === "approve";
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{approve ? "Approve refund" : "Reject refund"}</DialogTitle>
          <DialogDescription>
            {money(refund.amount)} to {refund.user_name}, requested by {refund.requested_by_name}.{" "}
            {approve
              ? "Approving records the refund, a credit note and the ledger entry. Pay the money back through M-Pesa or the card provider."
              : "Nothing is recorded; the requester can open a new request."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="text-muted-foreground">Reason: </span>
            {reasonLabel(refund.reason_code)}
            {refund.reason && ` · ${refund.reason}`}
          </p>
          <Label htmlFor="decision-note">Note (optional)</Label>
          <Textarea
            id="decision-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant={approve ? "default" : "destructive"}
            disabled={mutation.isPending}
            onClick={() =>
              mutation.mutate(
                { refundId: refund.refund_id, decision, note: note.trim() || undefined },
                {
                  onSuccess: () => {
                    setNote("");
                    onClose();
                  },
                },
              )
            }
          >
            {mutation.isPending ? "Saving…" : approve ? "Approve refund" : "Reject refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const RefundsPage: React.FC = () => {
  const { me } = useHasFinanceAccess();
  const [status, setStatus] = useState<RefundStatus | "">("requested");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFinanceRefundsQuery({ status, page, limit: LIMIT });
  const [target, setTarget] = useState<FinanceRefund | null>(null);
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);

  return (
    <PageLayout
      title="Refunds"
      subtitle="Refunds are requested from a payment and need a second finance user to approve them. Request one from Payments & invoices."
      controls={
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
            </Button>
          ))}
        </div>
      }
      pagination={
        data && <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />
      }
    >
      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requested</TableHead>
              <TableHead>Treasurer</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Requested by</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">
                <span className="sr-only">Decision</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Skeleton className="h-24 w-full" />
                </TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <EmptyRow colSpan={7}>
                {status === "requested"
                  ? "No refunds are waiting for approval."
                  : "No refunds here."}
              </EmptyRow>
            ) : (
              data?.items.map((r) => {
                const mine = !!me && r.requested_by === me.user_id;
                return (
                  <TableRow key={r.refund_id}>
                    <TableCell className="whitespace-nowrap">{dateTime(r.requested_at)}</TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/finance/accounts/${r.user_id}`}
                        className="hover:underline"
                      >
                        {r.user_name}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-56">
                      {reasonLabel(r.reason_code)}
                      {r.reason && (
                        <span className="block text-xs text-muted-foreground truncate">
                          {r.reason}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.requested_by_name}
                      {r.approved_by_name && (
                        <span className="block text-xs text-muted-foreground">
                          {r.status === "rejected" ? "Rejected" : "Approved"} by{" "}
                          {r.approved_by_name}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <RefundStatusBadge status={r.status} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{money(r.amount)}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {r.status === "requested" &&
                        (mine ? (
                          <span className="text-xs text-muted-foreground">
                            Your request; needs another approver
                          </span>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setTarget(r);
                                setDecision("reject");
                              }}
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setTarget(r);
                                setDecision("approve");
                              }}
                            >
                              Approve
                            </Button>
                          </div>
                        ))}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <DecisionDialog
        refund={target}
        decision={decision}
        onClose={() => {
          setTarget(null);
          setDecision(null);
        }}
      />
    </PageLayout>
  );
};
