"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type UsageMeter, useFinanceAccountQuery } from "@/features/admin/services/financeApi";
import { BackNavigation } from "@/features/shared/components/BackNavigation";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { cn } from "@/lib/utils";
import { InvoiceDetailSheet, PaymentDetailSheet } from "./DetailSheets";
import {
  GrantPlanDialog,
  SubscriptionActionDialog,
  type SubscriptionActionKind,
} from "./SubscriptionDialogs";
import {
  dateTime,
  EmptyRow,
  InvoiceStatusBadge,
  METHOD_LABELS,
  money,
  PaymentStatusBadge,
  RefundStatusBadge,
  StateBadge,
  shortDate,
} from "./shared";

const EVENT_LABELS: Record<string, string> = {
  upgraded: "Paid and moved plan",
  renewed: "Renewed",
  trial_started: "Trial started",
  comped: "Free grant",
  extended: "Extended",
  plan_changed: "Plan changed by finance",
  canceled: "Cancelled by finance",
  cancel_requested: "Turned off auto-renew",
  expired: "Expired to free tier",
  migrated: "History begins",
};

const Usage = ({ label, meter }: { label: string; meter: UsageMeter }) => {
  const over = meter.percent !== null && meter.percent >= 100;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span
          className={cn("tabular-nums", over && "font-semibold text-rose-700 dark:text-rose-400")}
        >
          {meter.used} / {meter.limit ?? "∞"}
          {over && " · at limit"}
        </span>
      </div>
      {meter.percent !== null && (
        <Progress value={Math.min(100, meter.percent)} aria-label={label} />
      )}
    </div>
  );
};

export const AccountPage: React.FC<{ identifier: string }> = ({ identifier }) => {
  const { data: a, isLoading, error } = useFinanceAccountQuery(identifier);
  const [action, setAction] = useState<SubscriptionActionKind | null>(null);
  const [grantOpen, setGrantOpen] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  if (error) {
    return <p className="text-sm text-destructive">Billing account not found.</p>;
  }
  if (isLoading || !a) {
    return <Skeleton className="h-96 w-full" />;
  }
  const sub = a.subscription;

  return (
    <PageLayout
      title={
        <span className="flex flex-col gap-2">
          <BackNavigation href="/admin/finance/subscriptions" label="Subscriptions" />
          {a.user.name}
        </span>
      }
      subtitle={`${a.user.email ?? ""} · ${a.user.phone_number ?? ""} · joined ${shortDate(a.user.joined_at)}`}
      actionButton={
        <div className="flex gap-2">
          {a.user.slug && (
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={`/admin/users/${a.user.slug}`} />}
            >
              User profile
            </Button>
          )}
          <Button onClick={() => setGrantOpen(true)}>Grant a plan</Button>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Subscription</CardDescription>
            <CardTitle className="text-2xl">{sub?.plan_name ?? "None"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {sub ? (
              <>
                <div className="flex items-center gap-2">
                  <StateBadge state={sub.state} />
                  {sub.end_date && (
                    <span className="text-muted-foreground">ends {shortDate(sub.end_date)}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAction("extend")}
                    disabled={sub.state === "free"}
                  >
                    Extend
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setAction("change_plan")}>
                    Change plan
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAction("cancel")}
                    disabled={sub.state === "free"}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">This user has never had a subscription.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lifetime value</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {money(a.balance.lifetime_value)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1 tabular-nums">
            <p>
              <span className="text-muted-foreground">Paid </span>
              {money(a.balance.lifetime_paid)}
            </p>
            <p>
              <span className="text-muted-foreground">Refunded </span>
              {money(a.balance.lifetime_refunded)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Usage against plan limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Usage label="Groups" meter={a.usage.groups} />
            <Usage label="Campaigns" meter={a.usage.campaigns} />
            <Usage label="Contributions this month" meter={a.usage.transactions_this_month} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments">
        <TabsList className="mb-4">
          <TabsTrigger value="payments">Payments ({a.payments.length})</TabsTrigger>
          <TabsTrigger value="invoices">Invoices ({a.invoices.length})</TabsTrigger>
          <TabsTrigger value="refunds">Refunds ({a.refunds.length})</TabsTrigger>
          <TabsTrigger value="history">Plan history ({a.events.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <div className="rounded-md border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {a.payments.length === 0 ? (
                  <EmptyRow colSpan={5}>No payments yet.</EmptyRow>
                ) : (
                  a.payments.map((p) => (
                    <TableRow
                      key={p.payment_id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setPaymentId(p.payment_id)}
                    >
                      <TableCell className="whitespace-nowrap">{dateTime(p.created_at)}</TableCell>
                      <TableCell className="font-mono text-xs">{p.invoice_number ?? "—"}</TableCell>
                      <TableCell>{METHOD_LABELS[p.method ?? ""] ?? p.method ?? "—"}</TableCell>
                      <TableCell>
                        <PaymentStatusBadge
                          status={p.status}
                          type={p.transaction_type}
                          refunded={p.refunded}
                        />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{money(p.amount)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <div className="rounded-md border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Service period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {a.invoices.length === 0 ? (
                  <EmptyRow colSpan={5}>No invoices yet.</EmptyRow>
                ) : (
                  a.invoices.map((i) => (
                    <TableRow
                      key={i.invoice_id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setInvoiceId(i.invoice_id)}
                    >
                      <TableCell className="font-mono text-xs">{i.number}</TableCell>
                      <TableCell>{shortDate(i.issued_at)}</TableCell>
                      <TableCell>
                        {i.period_start
                          ? `${shortDate(i.period_start)} – ${shortDate(i.period_end)}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <InvoiceStatusBadge status={i.status} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{money(i.total)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="refunds">
          <div className="rounded-md border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requested</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Requested / decided by</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {a.refunds.length === 0 ? (
                  <EmptyRow colSpan={5}>No refunds.</EmptyRow>
                ) : (
                  a.refunds.map((r) => (
                    <TableRow key={r.refund_id}>
                      <TableCell className="whitespace-nowrap">
                        {dateTime(r.requested_at)}
                      </TableCell>
                      <TableCell>{r.reason}</TableCell>
                      <TableCell>
                        {r.requested_by_name}
                        {r.approved_by_name && ` / ${r.approved_by_name}`}
                      </TableCell>
                      <TableCell>
                        <RefundStatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{money(r.amount)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <ol className="space-y-3">
            {a.events.length === 0 && (
              <li className="text-sm text-muted-foreground">No history recorded yet.</li>
            )}
            {a.events.map((e) => (
              <li
                key={`${e.at}-${e.type}`}
                className="rounded-md border border-border px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-medium">{EVENT_LABELS[e.type] ?? e.type}</span>
                  <span className="text-muted-foreground">{dateTime(e.at)}</span>
                </div>
                <p className="text-muted-foreground">
                  {[
                    e.from_plan && e.to_plan && e.from_plan !== e.to_plan
                      ? `${e.from_plan} → ${e.to_plan}`
                      : e.to_plan,
                    e.period_end && `until ${shortDate(e.period_end)}`,
                    e.actor_id ? "by staff" : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {e.reason && <p className="mt-1">{e.reason}</p>}
              </li>
            ))}
          </ol>
        </TabsContent>
      </Tabs>

      {sub && (
        <SubscriptionActionDialog
          subscription={{
            subscription_id: sub.subscription_id,
            user_name: a.user.name,
            plan_id: sub.plan_id,
            plan_name: sub.plan_name,
            end_date: sub.end_date,
          }}
          action={action}
          onClose={() => setAction(null)}
        />
      )}
      <GrantPlanDialog
        open={grantOpen}
        onClose={() => setGrantOpen(false)}
        presetUser={{ user_id: a.user.user_id, name: a.user.name }}
      />
      <PaymentDetailSheet paymentId={paymentId} onClose={() => setPaymentId(null)} />
      <InvoiceDetailSheet invoiceId={invoiceId} onClose={() => setInvoiceId(null)} />
    </PageLayout>
  );
};
