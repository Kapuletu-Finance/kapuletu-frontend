"use client";

import { addDays } from "date-fns";
import Link from "next/link";
import type React from "react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  type ContributionFilters,
  type ContributionStatementFormat,
  type IntegrityResult,
  useContributionRegisterQuery,
  useContributionVolumeQuery,
  useDownloadContributionStatementMutation,
  useIntegrityCheckMutation,
} from "@/features/admin/services/financeOpsApi";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { cn } from "@/lib/utils";
import {
  dateTime,
  EmptyRow,
  money,
  Pagination,
  presetRange,
  RANGE_PRESETS,
  type RangePreset,
  useDebouncedValue,
} from "./shared";

const count = (n: number) => new Intl.NumberFormat("en-KE").format(n);
const LIMIT = 25;
type ContributionRangePreset = RangePreset | "all";
const CONTRIBUTION_RANGE_PRESETS = [...RANGE_PRESETS, { value: "all" as const, label: "All time" }];
const STATEMENT_FORMATS: { value: ContributionStatementFormat; label: string }[] = [
  { value: "pdf", label: "Official PDF" },
  { value: "excel", label: "Excel" },
  { value: "csv", label: "CSV" },
];

const monthLabel = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-KE", { month: "short", year: "2-digit" });
};

const Integrity = ({ range }: { range: { from: string; to?: string } }) => {
  const check = useIntegrityCheckMutation();
  const result: IntegrityResult | undefined = check.data;
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>Ledger integrity</CardTitle>
          <CardDescription>
            Re-computes the tamper seal on every approved contribution in the period. Any mismatch
            means a record changed after approval.
          </CardDescription>
        </div>
        <Button onClick={() => check.mutate(range)} disabled={check.isPending}>
          {check.isPending ? "Checking…" : "Run check"}
        </Button>
      </CardHeader>
      {result && (
        <CardContent className="space-y-3 text-sm">
          <p
            role="status"
            className={cn(
              "rounded-md border px-4 py-3",
              result.tampered.length
                ? "border-rose-600/40 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
                : "border-emerald-600/40 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
            )}
          >
            {result.tampered.length
              ? `${result.tampered.length} of ${count(result.checked)} records fail their seal.`
              : `All ${count(result.intact)} sealed records are intact.`}
            {result.unsealed > 0 &&
              ` ${count(result.unsealed)} records have no seal (approved before sealing existed).`}
            {result.truncated &&
              " Only the first 20,000 were checked; narrow the period to check the rest."}
          </p>
          {result.tampered.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Approved</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="text-right">Amount now</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.tampered.map((t) => (
                  <TableRow key={t.transaction_id}>
                    <TableCell>{dateTime(t.created_at)}</TableCell>
                    <TableCell>{t.group_name}</TableCell>
                    <TableCell className="font-mono text-xs">{t.transaction_code}</TableCell>
                    <TableCell className="text-right tabular-nums">{money(t.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export const ContributionsPage: React.FC = () => {
  const [preset, setPreset] = useState<ContributionRangePreset>("12m");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const [treasurer, setTreasurer] = useState("");
  const [contributor, setContributor] = useState("");
  const [method, setMethod] = useState("");
  const [page, setPage] = useState(1);
  const searchValue = useDebouncedValue(search);
  const groupValue = useDebouncedValue(group);
  const treasurerValue = useDebouncedValue(treasurer);
  const contributorValue = useDebouncedValue(contributor);
  const methodValue = useDebouncedValue(method);
  const range = useMemo(() => {
    const defaultRange = preset === "all" ? { from: "1970-01-01T00:00:00" } : presetRange(preset);
    return {
      from: fromDate
        ? new Date(`${fromDate}T00:00:00`).toISOString().slice(0, 19)
        : defaultRange.from,
      to: toDate
        ? addDays(new Date(`${toDate}T00:00:00`), 1)
            .toISOString()
            .slice(0, 19)
        : defaultRange.to,
    };
  }, [fromDate, preset, toDate]);
  const { data, isLoading, isFetching } = useContributionVolumeQuery(range.from, range.to);
  const filters: Omit<ContributionFilters, "page" | "limit"> = {
    ...range,
    q: searchValue,
    group: groupValue,
    treasurer: treasurerValue,
    contributor: contributorValue,
    method: methodValue,
  };
  const register = useContributionRegisterQuery({ ...filters, page, limit: LIMIT });
  const statement = useDownloadContributionStatementMutation();
  const total = data?.totals.amount ?? 0;
  const updateFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <PageLayout
      title="Contributions"
      subtitle="Money treasurers' groups collect through Kapuletu. This is their money, not Kapuletu revenue; it's read-only here."
      actionButton={
        <Select
          value={preset}
          onValueChange={(value) => {
            if (value) {
              setPreset(value as ContributionRangePreset);
              setPage(1);
            }
          }}
        >
          <SelectTrigger className="w-44" aria-label="Period">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONTRIBUTION_RANGE_PRESETS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : !data ? (
        <p role="alert" className="text-sm text-destructive">
          Could not load the contribution summary. Please check the selected period and retry.
        </p>
      ) : (
        <div className={cn("space-y-6", isFetching && "opacity-70")}>
          <dl className="grid gap-4 grid-cols-2 lg:grid-cols-5">
            {[
              ["Collected", money(data.totals.amount)],
              ["Contributions", count(data.totals.contributions)],
              ["Average contribution", money(data.totals.average_contribution)],
              ["Active groups", count(data.totals.active_groups)],
              ["Active treasurers", count(data.totals.active_treasurers)],
            ].map(([label, value]) => (
              <Card key={label}>
                <CardHeader className="pb-2">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
                </CardHeader>
              </Card>
            ))}
          </dl>

          <Card>
            <CardHeader>
              <CardTitle>Collected per month</CardTitle>
              <CardDescription>Approved contributions, all groups.</CardDescription>
            </CardHeader>
            <CardContent>
              {data.by_month.length === 0 ? (
                <p className="text-sm text-muted-foreground">No contributions in this period.</p>
              ) : (
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.by_month}
                      margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
                    >
                      <CartesianGrid vertical={false} stroke="var(--border)" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={monthLabel}
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tickFormatter={(v: number) =>
                          v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)
                        }
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                        width={44}
                      />
                      <Tooltip
                        cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                        contentStyle={{
                          background: "var(--popover)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          color: "var(--popover-foreground)",
                        }}
                        labelFormatter={(m) => monthLabel(String(m))}
                        formatter={(value, _name, item) => [
                          `${money(Number(value))} · ${count((item?.payload as { contributions: number })?.contributions ?? 0)} contributions`,
                          "Collected",
                        ]}
                      />
                      <Bar
                        dataKey="amount"
                        fill="var(--primary)"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={36}
                        isAnimationActive={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>By payment method</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Contributions</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Share</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.by_method.length === 0 ? (
                      <EmptyRow colSpan={4}>None.</EmptyRow>
                    ) : (
                      data.by_method.map((m) => (
                        <TableRow key={m.method}>
                          <TableCell>{m.method}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {count(m.contributions)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {money(m.amount)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {total ? `${((m.amount / total) * 100).toFixed(1)}%` : "—"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Largest groups</CardTitle>
                <CardDescription>By amount collected in the period.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Group</TableHead>
                      <TableHead className="text-right">Contributions</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.top_groups.length === 0 ? (
                      <EmptyRow colSpan={3}>None.</EmptyRow>
                    ) : (
                      data.top_groups.map((g) => (
                        <TableRow key={g.group_id}>
                          <TableCell>
                            {g.group_name}
                            <Link
                              href={`/admin/finance/accounts/${g.treasurer_id}`}
                              className="block text-xs text-muted-foreground hover:underline"
                            >
                              {g.treasurer}
                            </Link>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {count(g.contributions)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {money(g.amount)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle>Contribution register</CardTitle>
            <CardDescription>
              Search approved contributions by contributor, group, treasurer, campaign, payment
              method, or reference. Downloads include all records matching the filters.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {STATEMENT_FORMATS.map((format) => (
              <Button
                key={format.value}
                variant={format.value === "pdf" ? "default" : "outline"}
                size="sm"
                disabled={statement.isPending}
                onClick={() => statement.mutate({ format: format.value, filters })}
              >
                {statement.isPending ? "Preparing…" : format.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              type="date"
              aria-label="From date"
              value={fromDate}
              onChange={(event) => updateFilter(setFromDate)(event.target.value)}
            />
            <Input
              type="date"
              aria-label="To date"
              value={toDate}
              onChange={(event) => updateFilter(setToDate)(event.target.value)}
            />
            <Input
              aria-label="Search contributions"
              placeholder="Search all fields"
              value={search}
              onChange={(event) => updateFilter(setSearch)(event.target.value)}
            />
            <Input
              aria-label="Filter by group"
              placeholder="Group"
              value={group}
              onChange={(event) => updateFilter(setGroup)(event.target.value)}
            />
            <Input
              aria-label="Filter by treasurer"
              placeholder="Treasurer name or email"
              value={treasurer}
              onChange={(event) => updateFilter(setTreasurer)(event.target.value)}
            />
            <Input
              aria-label="Filter by contributor"
              placeholder="Contributor name or phone"
              value={contributor}
              onChange={(event) => updateFilter(setContributor)(event.target.value)}
            />
            <Input
              aria-label="Filter by payment method"
              placeholder="Payment method"
              value={method}
              onChange={(event) => updateFilter(setMethod)(event.target.value)}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setSearch("");
                  setGroup("");
                  setTreasurer("");
                  setContributor("");
                  setMethod("");
                  setPage(1);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>
              {register.data
                ? `${count(register.data.total)} matching contributions · ${money(register.data.total_amount)}`
                : "Loading contribution records…"}
            </span>
            <span>Only approved contributions are included.</span>
          </div>
          {register.isError ? (
            <p role="alert" className="text-sm text-destructive">
              Could not load contribution records. Please retry.
            </p>
          ) : (
            <div className={cn("space-y-2", register.isFetching && "opacity-70")}>
              <div className="overflow-x-auto rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Contributor</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Treasurer</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {register.isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8}>
                          <Skeleton className="h-20 w-full" />
                        </TableCell>
                      </TableRow>
                    ) : register.data?.items.length ? (
                      register.data.items.map((item) => (
                        <TableRow key={item.transaction_id}>
                          <TableCell className="whitespace-nowrap">
                            {item.created_at ? dateTime(item.created_at) : "—"}
                          </TableCell>
                          <TableCell>
                            {item.contributor_name || "Unknown"}
                            {item.contributor_phone && (
                              <span className="block text-xs text-muted-foreground">
                                {item.contributor_phone}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{item.group_name}</TableCell>
                          <TableCell>{item.treasurer_name}</TableCell>
                          <TableCell>{item.campaign_name || "—"}</TableCell>
                          <TableCell>{item.payment_method}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {item.transaction_code}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {money(item.amount)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <EmptyRow colSpan={8}>
                        No approved contributions match these filters.
                      </EmptyRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {register.data && (
                <Pagination
                  page={page}
                  limit={LIMIT}
                  total={register.data.total}
                  onPage={setPage}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Integrity range={range} />
    </PageLayout>
  );
};
