"use client";

import Link from "next/link";
import type React from "react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  type IntegrityResult,
  useContributionVolumeQuery,
  useIntegrityCheckMutation,
} from "@/features/admin/services/financeOpsApi";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { cn } from "@/lib/utils";
import { dateTime, EmptyRow, money, presetRange, RANGE_PRESETS, type RangePreset } from "./shared";

const count = (n: number) => new Intl.NumberFormat("en-KE").format(n);

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
  const [preset, setPreset] = useState<RangePreset>("12m");
  const range = useMemo(() => presetRange(preset), [preset]);
  const { data, isLoading, isFetching } = useContributionVolumeQuery(range.from, range.to);
  const total = data?.totals.amount ?? 0;

  return (
    <PageLayout
      title="Contributions"
      subtitle="Money treasurers' groups collect through Kapuletu. This is their money, not Kapuletu revenue; it's read-only here."
      actionButton={
        <Select value={preset} onValueChange={(v) => v && setPreset(v as RangePreset)}>
          <SelectTrigger className="w-44" aria-label="Period">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGE_PRESETS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      {isLoading || !data ? (
        <Skeleton className="h-96 w-full" />
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

      <Integrity range={range} />
    </PageLayout>
  );
};
