"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  type FinanceSubscription,
  type SubscriptionState,
  useFinanceSubscriptionsQuery,
  useSubscriptionSummaryQuery,
} from "@/features/admin/services/financeApi";
import { useAdminFinancePlansQuery } from "@/features/admin/services/queries";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { cn } from "@/lib/utils";
import {
  GrantPlanDialog,
  SubscriptionActionDialog,
  type SubscriptionActionKind,
} from "./SubscriptionDialogs";
import {
  EmptyRow,
  Pagination,
  StateBadge,
  SUBSCRIPTION_STATES,
  shortDate,
  useDebouncedValue,
} from "./shared";

const LIMIT = 25;
const ALL = "all";

export const SubscriptionsPage: React.FC = () => {
  const params = useSearchParams();
  const initialState = params.get("state");
  const [state, setState] = useState<SubscriptionState | "">(
    SUBSCRIPTION_STATES.some((s) => s.value === initialState)
      ? (initialState as SubscriptionState)
      : "",
  );
  const [planId, setPlanId] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebouncedValue(search);

  const { data, isLoading } = useFinanceSubscriptionsQuery({
    state,
    plan_id: planId,
    q,
    page,
    limit: LIMIT,
  });
  const { data: counts } = useSubscriptionSummaryQuery();
  const { data: plans } = useAdminFinancePlansQuery();

  const [grantOpen, setGrantOpen] = useState(false);
  const [target, setTarget] = useState<FinanceSubscription | null>(null);
  const [action, setAction] = useState<SubscriptionActionKind | null>(null);
  const openAction = (sub: FinanceSubscription, kind: SubscriptionActionKind) => {
    setTarget(sub);
    setAction(kind);
  };

  const total = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : undefined;
  const chips: { value: SubscriptionState | ""; label: string; count?: number }[] = [
    { value: "", label: "All", count: total },
    ...SUBSCRIPTION_STATES.map((s) => ({ ...s, count: counts?.[s.value] })),
  ];

  return (
    <PageLayout
      title="Subscriptions"
      subtitle="Every treasurer's plan and where it stands. Select a name for their full billing account."
      actionButton={<Button onClick={() => setGrantOpen(true)}>Grant a plan</Button>}
      controls={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by state">
            {chips.map((c) => (
              <Button
                key={c.value || ALL}
                size="sm"
                variant={state === c.value ? "default" : "outline"}
                aria-pressed={state === c.value}
                onClick={() => {
                  setState(c.value);
                  setPage(1);
                }}
              >
                {c.label}
                {c.count !== undefined && (
                  <span className="ml-1.5 tabular-nums opacity-70">{c.count}</span>
                )}
              </Button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, email, phone"
              className="sm:max-w-xs"
              aria-label="Search subscriptions"
            />
            <Select
              value={planId || ALL}
              onValueChange={(v) => {
                setPlanId(!v || v === ALL ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-48" aria-label="Plan">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All plans</SelectItem>
                {plans?.map((p) => (
                  <SelectItem key={p.plan_id} value={p.plan_id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
              <TableHead>Treasurer</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Ends</TableHead>
              <TableHead className="text-right">Days left</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              ["a", "b", "c", "d", "e"].map((k) => (
                <TableRow key={k}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.items.length === 0 ? (
              <EmptyRow colSpan={6}>No subscriptions match these filters.</EmptyRow>
            ) : (
              data?.items.map((s) => (
                <TableRow key={s.subscription_id}>
                  <TableCell>
                    <Link
                      href={`/admin/finance/accounts/${s.user_slug || s.user_id}`}
                      className="font-medium hover:underline"
                    >
                      {s.user_name}
                    </Link>
                    <span className="block text-xs text-muted-foreground">{s.user_email}</span>
                  </TableCell>
                  <TableCell>{s.plan_name}</TableCell>
                  <TableCell>
                    <StateBadge state={s.state} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {s.end_date ? shortDate(s.end_date) : "No end"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right tabular-nums",
                      s.days_remaining !== null &&
                        s.days_remaining <= 3 &&
                        s.state !== "free" &&
                        "font-semibold",
                    )}
                  >
                    {s.days_remaining ?? "—"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                        aria-label={`Actions for ${s.user_name}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openAction(s, "extend")}
                          disabled={s.state === "free"}
                        >
                          Extend
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openAction(s, "change_plan")}>
                          Change plan
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openAction(s, "cancel")}
                          disabled={s.state === "free"}
                          className="text-destructive focus:text-destructive"
                        >
                          Cancel subscription
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SubscriptionActionDialog
        subscription={target}
        action={action}
        onClose={() => {
          setAction(null);
          setTarget(null);
        }}
      />
      <GrantPlanDialog open={grantOpen} onClose={() => setGrantOpen(false)} />
    </PageLayout>
  );
};
