"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  useFinanceInvoicesQuery,
  useFinancePaymentsQuery,
} from "@/features/admin/services/financeApi";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { cn } from "@/lib/utils";
import { InvoiceDetailSheet, PaymentDetailSheet } from "./DetailSheets";
import {
  dateTime,
  EmptyRow,
  InvoiceStatusBadge,
  METHOD_LABELS,
  money,
  Pagination,
  PaymentStatusBadge,
  presetRange,
  RANGE_PRESETS,
  type RangePreset,
  shortDate,
  useDebouncedValue,
} from "./shared";

const LIMIT = 25;
const ALL = "all";

type Option = { value: string; label: string };

const FilterSelect = ({
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
  <Select value={value || ALL} onValueChange={(v) => onChange(!v || v === ALL ? "" : v)}>
    <SelectTrigger className="sm:w-44" aria-label={label}>
      <SelectValue />
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

const RANGE_OPTIONS: Option[] = RANGE_PRESETS.map((p) => ({ value: p.value, label: p.label }));

const clickableRow = "cursor-pointer hover:bg-muted/50 focus-visible:bg-muted/50 outline-none";

const PaymentsTable = ({ onOpen }: { onOpen: (id: string) => void }) => {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [provider, setProvider] = useState("");
  const [range, setRange] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebouncedValue(search);
  const bounds = useMemo(() => (range ? presetRange(range as RangePreset) : {}), [range]);
  const reset =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v);
      setPage(1);
    };

  const { data, isLoading } = useFinancePaymentsQuery({
    status,
    type,
    provider,
    q,
    ...bounds,
    page,
    limit: LIMIT,
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
        <Input
          value={search}
          onChange={(e) => reset(setSearch)(e.target.value)}
          placeholder="Receipt, invoice no., name"
          className="sm:max-w-xs"
          aria-label="Search payments"
        />
        <FilterSelect
          label="Status"
          value={status}
          onChange={reset(setStatus)}
          allLabel="All statuses"
          options={[
            { value: "success", label: "Paid" },
            { value: "pending", label: "Pending" },
            { value: "failed", label: "Failed" },
          ]}
        />
        <FilterSelect
          label="Type"
          value={type}
          onChange={reset(setType)}
          allLabel="All types"
          options={[
            { value: "payment", label: "Payments" },
            { value: "refund", label: "Refunds" },
            { value: "comp", label: "Free grants" },
          ]}
        />
        <FilterSelect
          label="Method"
          value={provider}
          onChange={reset(setProvider)}
          allLabel="All methods"
          options={[
            { value: "mpesa", label: "M-Pesa" },
            { value: "flutterwave", label: "Card (Flutterwave)" },
          ]}
        />
        <FilterSelect
          label="Period"
          value={range}
          onChange={reset(setRange)}
          allLabel="All time"
          options={RANGE_OPTIONS}
        />
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Treasurer</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Skeleton className="h-24 w-full" />
                </TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <EmptyRow colSpan={6}>No payments match these filters.</EmptyRow>
            ) : (
              data?.items.map((p) => (
                <TableRow
                  key={p.payment_id}
                  className={clickableRow}
                  tabIndex={0}
                  onClick={() => onOpen(p.payment_id)}
                  onKeyDown={(e) => e.key === "Enter" && onOpen(p.payment_id)}
                >
                  <TableCell className="whitespace-nowrap">{dateTime(p.created_at)}</TableCell>
                  <TableCell>
                    {p.user_name}
                    <span className="block text-xs text-muted-foreground">{p.plan_name}</span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{p.invoice_number ?? "—"}</TableCell>
                  <TableCell>{METHOD_LABELS[p.method ?? ""] ?? p.method ?? "—"}</TableCell>
                  <TableCell>
                    <PaymentStatusBadge
                      status={p.status}
                      type={p.transaction_type}
                      refunded={p.refunded}
                    />
                  </TableCell>
                  <TableCell
                    className={cn("text-right tabular-nums", p.amount < 0 && "text-destructive")}
                  >
                    {money(p.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {data && <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />}
    </div>
  );
};

const InvoicesTable = ({ onOpen }: { onOpen: (id: string) => void }) => {
  const [status, setStatus] = useState("");
  const [range, setRange] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebouncedValue(search);
  const bounds = useMemo(() => (range ? presetRange(range as RangePreset) : {}), [range]);
  const { data, isLoading } = useFinanceInvoicesQuery({ status, q, ...bounds, page, limit: LIMIT });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Invoice number or name"
          className="sm:max-w-xs"
          aria-label="Search invoices"
        />
        <FilterSelect
          label="Status"
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          allLabel="All statuses"
          options={[
            { value: "paid", label: "Paid" },
            { value: "open", label: "Awaiting payment" },
            { value: "void", label: "Void" },
          ]}
        />
        <FilterSelect
          label="Period"
          value={range}
          onChange={(v) => {
            setRange(v);
            setPage(1);
          }}
          allLabel="All time"
          options={RANGE_OPTIONS}
        />
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Treasurer</TableHead>
              <TableHead>Service period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Skeleton className="h-24 w-full" />
                </TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <EmptyRow colSpan={6}>No invoices match these filters.</EmptyRow>
            ) : (
              data?.items.map((i) => (
                <TableRow
                  key={i.invoice_id}
                  className={clickableRow}
                  tabIndex={0}
                  onClick={() => onOpen(i.invoice_id)}
                  onKeyDown={(e) => e.key === "Enter" && onOpen(i.invoice_id)}
                >
                  <TableCell className="font-mono text-xs">{i.number}</TableCell>
                  <TableCell className="whitespace-nowrap">{shortDate(i.issued_at)}</TableCell>
                  <TableCell>{i.user_name}</TableCell>
                  <TableCell className="whitespace-nowrap">
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
      {data && <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />}
    </div>
  );
};

export const PaymentsPage: React.FC = () => {
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  return (
    <PageLayout
      title="Payments & invoices"
      subtitle="Every checkout attempt, refund and free grant, and the invoices they settle. Select a row for details."
    >
      <Tabs defaultValue="payments">
        <TabsList className="mb-4">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="payments">
          <PaymentsTable onOpen={setPaymentId} />
        </TabsContent>
        <TabsContent value="invoices">
          <InvoicesTable onOpen={setInvoiceId} />
        </TabsContent>
      </Tabs>

      <PaymentDetailSheet
        paymentId={paymentId}
        onClose={() => setPaymentId(null)}
        onOpenInvoice={(id) => {
          setPaymentId(null);
          setInvoiceId(id);
        }}
      />
      <InvoiceDetailSheet
        invoiceId={invoiceId}
        onClose={() => setInvoiceId(null)}
        onOpenPayment={(id) => {
          setInvoiceId(null);
          setPaymentId(id);
        }}
      />
    </PageLayout>
  );
};
