"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useFinanceInvoiceQuery,
  useFinancePaymentQuery,
} from "@/features/admin/services/financeApi";
import { useDownloadFinanceInvoiceMutation } from "@/features/admin/services/financeOpsApi";
import { RefundRequestDialog } from "./RefundRequestDialog";
import {
  dateTime,
  InvoiceStatusBadge,
  METHOD_LABELS,
  money,
  PaymentStatusBadge,
  RefundStatusBadge,
  shortDate,
} from "./shared";

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex justify-between gap-4 py-1.5 text-sm">
    <dt className="text-muted-foreground shrink-0">{label}</dt>
    <dd className="text-right break-all">{children}</dd>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-2">
    <h3 className="text-sm font-semibold">{title}</h3>
    {children}
  </section>
);

const SheetShell = ({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
    <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
        {description && <SheetDescription>{description}</SheetDescription>}
      </SheetHeader>
      <div className="px-4 pb-6 space-y-6">{children}</div>
    </SheetContent>
  </Sheet>
);

export const PaymentDetailSheet: React.FC<{
  paymentId: string | null;
  onClose: () => void;
  onOpenInvoice?: (invoiceId: string) => void;
}> = ({ paymentId, onClose, onOpenInvoice }) => {
  const { data: p, isLoading } = useFinancePaymentQuery(paymentId);
  const [refundOpen, setRefundOpen] = useState(false);
  const refundable =
    p && p.status === "success" && p.transaction_type === "payment" && p.amount > 0 && !p.refund;

  return (
    <>
      <SheetShell
        open={!!paymentId}
        onClose={onClose}
        title={p ? money(p.amount) : "Payment"}
        description={p ? `${p.user_name} · ${dateTime(p.created_at)}` : undefined}
      >
        {isLoading || !p ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <>
            <dl className="divide-y divide-border">
              <Row label="Status">
                <PaymentStatusBadge
                  status={p.status}
                  type={p.transaction_type}
                  refunded={p.refunded}
                />
              </Row>
              <Row label="Method">{METHOD_LABELS[p.method ?? ""] ?? p.method ?? "—"}</Row>
              <Row label="Plan">{p.plan_name ?? "—"}</Row>
              <Row label="Invoice">
                {p.invoice_id && onOpenInvoice ? (
                  <button
                    type="button"
                    className="underline"
                    onClick={() => onOpenInvoice(p.invoice_id as string)}
                  >
                    {p.invoice_number}
                  </button>
                ) : (
                  (p.invoice_number ?? "—")
                )}
              </Row>
              <Row label="Receipt (M-Pesa / card)">{p.receipt_number ?? "—"}</Row>
              <Row label="Checkout reference">{p.provider_reference ?? "—"}</Row>
              {p.failure_reason && <Row label="Failure reason">{p.failure_reason}</Row>}
              <Row label="Customer">
                <Link href={`/admin/finance/accounts/${p.user_id}`} className="underline">
                  Billing account
                </Link>
              </Row>
            </dl>

            <Section title="Refund">
              {p.refund ? (
                <div className="flex items-center justify-between text-sm">
                  <span>{money(p.refund.amount)}</span>
                  <RefundStatusBadge status={p.refund.status} />
                </div>
              ) : refundable ? (
                <Button variant="outline" size="sm" onClick={() => setRefundOpen(true)}>
                  Request a refund
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">Not refundable.</p>
              )}
            </Section>

            <Section title={`Provider callbacks (${p.provider_events.length})`}>
              {p.provider_events.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No callbacks received for this checkout.
                </p>
              ) : (
                p.provider_events.map((e) => (
                  <details key={e.received_at} className="rounded-md border border-border">
                    <summary className="cursor-pointer px-3 py-2 text-sm">
                      {dateTime(e.received_at)} · {e.provider} · {e.outcome ?? "pending"}
                    </summary>
                    <pre className="max-h-64 overflow-auto bg-muted/50 px-3 py-2 text-xs">
                      {JSON.stringify(e.payload, null, 2)}
                    </pre>
                  </details>
                ))
              )}
            </Section>
          </>
        )}
      </SheetShell>
      <RefundRequestDialog
        payment={
          refundOpen && p
            ? { payment_id: p.payment_id, amount: p.amount, user_name: p.user_name }
            : null
        }
        onClose={() => setRefundOpen(false)}
      />
    </>
  );
};

export const InvoiceDetailSheet: React.FC<{
  invoiceId: string | null;
  onClose: () => void;
  onOpenPayment?: (paymentId: string) => void;
}> = ({ invoiceId, onClose, onOpenPayment }) => {
  const { data: inv, isLoading } = useFinanceInvoiceQuery(invoiceId);
  const downloadInvoice = useDownloadFinanceInvoiceMutation();

  return (
    <SheetShell
      open={!!invoiceId}
      onClose={onClose}
      title={inv ? `Invoice ${inv.number}` : "Invoice"}
      description={inv ? `${inv.user_name} · issued ${shortDate(inv.issued_at)}` : undefined}
    >
      {isLoading || !inv ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            disabled={downloadInvoice.isPending}
            onClick={() =>
              downloadInvoice.mutate({ invoiceId: inv.invoice_id, number: inv.number })
            }
          >
            {downloadInvoice.isPending ? "Preparing PDF…" : "Download invoice PDF"}
          </Button>

          <dl className="divide-y divide-border">
            <Row label="Status">
              <InvoiceStatusBadge status={inv.status} />
            </Row>
            <Row label="Billing">{inv.billing_cycle === "annual" ? "Annual" : "Monthly"}</Row>
            <Row label="Service period">
              {inv.period_start
                ? `${shortDate(inv.period_start)} to ${shortDate(inv.period_end)}`
                : "Starts when paid"}
            </Row>
            <Row label="Paid">{inv.paid_at ? dateTime(inv.paid_at) : "—"}</Row>
            {inv.notes && <Row label="Notes">{inv.notes}</Row>}
          </dl>

          <Section title="Lines">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {inv.lines.map((l) => (
                  <tr key={`${l.kind}-${l.description}`}>
                    <td className="py-1.5">{l.description}</td>
                    <td className="py-1.5 text-right tabular-nums">{money(l.amount)}</td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="py-1.5">Total</td>
                  <td className="py-1.5 text-right tabular-nums">{money(inv.total)}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section title="Payments">
            {inv.payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payment attempts.</p>
            ) : (
              <ul className="divide-y divide-border text-sm">
                {inv.payments.map((pay) => (
                  <li key={pay.payment_id} className="flex items-center justify-between py-1.5">
                    <button
                      type="button"
                      className="underline disabled:no-underline"
                      disabled={!onOpenPayment}
                      onClick={() => onOpenPayment?.(pay.payment_id)}
                    >
                      {dateTime(pay.created_at)}
                    </button>
                    <PaymentStatusBadge status={pay.status} refunded={pay.refunded} />
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {inv.credit_notes.length > 0 && (
            <Section title="Credit notes">
              <ul className="divide-y divide-border text-sm">
                {inv.credit_notes.map((c) => (
                  <li key={c.number} className="flex justify-between py-1.5">
                    <span>
                      {c.number} · {shortDate(c.issued_at)}
                      {c.reason && (
                        <span className="block text-xs text-muted-foreground">{c.reason}</span>
                      )}
                    </span>
                    <span className="tabular-nums">−{money(c.amount)}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </>
      )}
    </SheetShell>
  );
};
