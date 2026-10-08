"use client";

import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
  type MetricKey,
  type MetricValue,
  type MrrPoint,
  useFinanceOverviewQuery,
  useMrrSeriesQuery,
} from "@/features/admin/services/financeApi";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { cn } from "@/lib/utils";
import { CohortRetentionTable } from "./charts/CohortRetentionTable";
import { RevenueFlowChart } from "./charts/RevenueFlowChart";
import {
  money,
  presetRange,
  RANGE_PRESETS,
  type RangePreset,
  SUBSCRIPTION_STATES,
  shortDate,
} from "./shared";

type Kind = "money" | "count" | "percent";

interface TileSpec {
  key: MetricKey;
  label: string;
  kind: Kind;
  /** Whether a rise is good news (drives the delta colour; the arrow and sign carry it too). */
  upIsGood: boolean;
  hint?: string;
}

const HEADLINE: TileSpec[] = [
  {
    key: "mrr",
    label: "Monthly recurring revenue",
    kind: "money",
    upIsGood: true,
    hint: "At period end",
  },
  { key: "arr", label: "Annual run rate", kind: "money", upIsGood: true, hint: "MRR × 12" },
  {
    key: "paying_customers",
    label: "Paying customers",
    kind: "count",
    upIsGood: true,
    hint: "At period end",
  },
  {
    key: "arpu",
    label: "Revenue per customer",
    kind: "money",
    upIsGood: true,
    hint: "MRR ÷ paying customers",
  },
];

const PERIOD: TileSpec[] = [
  {
    key: "net_revenue",
    label: "Net revenue",
    kind: "money",
    upIsGood: true,
    hint: "Revenue minus refunds",
  },
  { key: "new_paying_customers", label: "New paying customers", kind: "count", upIsGood: true },
  {
    key: "churn_rate_percent",
    label: "Customer churn",
    kind: "percent",
    upIsGood: false,
    hint: "Paying at start, not at end",
  },
  {
    key: "failed_payment_rate_percent",
    label: "Failed payments",
    kind: "percent",
    upIsGood: false,
    hint: "Of settled checkouts",
  },
  { key: "refunds", label: "Refunds", kind: "money", upIsGood: false },
  { key: "cash_collected", label: "Cash collected", kind: "money", upIsGood: true },
  { key: "trials_started", label: "Trials started", kind: "count", upIsGood: true },
  {
    key: "trial_conversion_rate_percent",
    label: "Trial conversion",
    kind: "percent",
    upIsGood: true,
    hint: "Trials started that paid",
  },
];

const formatValue = (value: number, kind: Kind) => {
  if (kind === "money") return money(value);
  if (kind === "percent") return `${value.toFixed(1)}%`;
  return new Intl.NumberFormat("en-KE").format(value);
};

const Delta = ({ metric, spec }: { metric: MetricValue; spec: TileSpec }) => {
  // Rates change in percentage points; amounts and counts in percent.
  const diff = spec.kind === "percent" ? metric.current - metric.previous : metric.change_pct;
  if (diff === null || diff === undefined) {
    return <span className="text-muted-foreground">No previous data</span>;
  }
  if (Math.abs(diff) < 0.05) {
    return (
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        <ArrowRight className="h-3.5 w-3.5" aria-hidden /> No change
      </span>
    );
  }
  const up = diff > 0;
  const good = up === spec.upIsGood;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  const text =
    spec.kind === "percent"
      ? `${up ? "+" : ""}${diff.toFixed(1)} pts`
      : `${up ? "+" : ""}${diff.toFixed(1)}%`;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        good ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400",
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {text}
    </span>
  );
};

const StatTile = ({
  spec,
  metric,
  large,
}: {
  spec: TileSpec;
  metric?: MetricValue;
  large?: boolean;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardDescription>{spec.label}</CardDescription>
      <CardTitle className={cn("font-semibold tabular-nums", large ? "text-3xl" : "text-2xl")}>
        {metric ? formatValue(metric.current, spec.kind) : <Skeleton className="h-8 w-28" />}
      </CardTitle>
    </CardHeader>
    <CardContent className="text-xs space-y-1">
      {metric && (
        <p>
          <Delta metric={metric} spec={spec} />{" "}
          <span className="text-muted-foreground">
            vs {formatValue(metric.previous, spec.kind)} before
          </span>
        </p>
      )}
      {spec.hint && <p className="text-muted-foreground">{spec.hint}</p>}
    </CardContent>
  </Card>
);

const MrrTrend = () => {
  const { data, isLoading } = useMrrSeriesQuery(12);
  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>MRR, last 12 months</CardTitle>
        <CardDescription>Recurring revenue at the start of each month, and today.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-[260px] w-full" />
        ) : (
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d: string) => shortDate(d).split(" ").slice(1).join(" ")}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "3 3" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--popover-foreground)",
                  }}
                  labelFormatter={(d) => shortDate(String(d))}
                  formatter={(value, _name, item) => [
                    `${money(Number(value))} · ${(item?.payload as MrrPoint | undefined)?.paying_customers ?? 0} paying`,
                    "MRR",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="mrr"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const FinanceOverviewPage: React.FC = () => {
  const [preset, setPreset] = useState<RangePreset>("30d");
  const [interval, setInterval] = useState<"month" | "week">("month");
  const range = useMemo(() => presetRange(preset), [preset]);
  const { data, isFetching } = useFinanceOverviewQuery(range.from, range.to);
  const m = data?.metrics;

  return (
    <PageLayout
      title="Finance overview"
      subtitle={
        data
          ? `${shortDate(data.period.from)} to ${shortDate(data.period.to)}, compared with ${shortDate(
              data.previous_period.from,
            )} to ${shortDate(data.previous_period.to)}`
          : "Loading…"
      }
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
      <div className={cn("space-y-6 transition-opacity", isFetching && "opacity-70")}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {HEADLINE.map((spec) => (
            <StatTile key={spec.key} spec={spec} metric={m?.[spec.key]} large />
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PERIOD.map((spec) => (
            <StatTile key={spec.key} spec={spec} metric={m?.[spec.key]} />
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <MrrTrend />
          <Card>
            <CardHeader>
              <CardTitle>Subscriptions now</CardTitle>
              <CardDescription>By state. Select one to see the list.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {SUBSCRIPTION_STATES.map((s) => (
                  <li key={s.value}>
                    <Link
                      href={`/admin/finance/subscriptions?state=${s.value}`}
                      className="flex items-center justify-between py-2.5 text-sm hover:text-primary"
                    >
                      <span>{s.label}</span>
                      <span className="font-semibold tabular-nums">
                        {data ? data.subscriptions[s.value] : "…"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Invoiced revenue by plan</h2>
            <Select value={interval} onValueChange={(v) => v && setInterval(v as "month" | "week")}>
              <SelectTrigger className="w-36" aria-label="Interval">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <RevenueFlowChart interval={interval} />
        </div>

        <CohortRetentionTable />
      </div>
    </PageLayout>
  );
};
