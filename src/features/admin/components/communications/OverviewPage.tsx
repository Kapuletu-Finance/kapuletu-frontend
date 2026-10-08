"use client";

import Link from "next/link";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type Channel,
  useBroadcastsQuery,
  useCommsOverviewQuery,
} from "@/features/admin/services/communicationsApi";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { BroadcastStatusBadge, CHANNEL_LABELS, DeliverySummary, shortDate, totals } from "./shared";

const Kpi = ({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardDescription>{label}</CardDescription>
      <CardTitle className="text-2xl font-semibold tabular-nums">{value}</CardTitle>
    </CardHeader>
    {hint && <CardContent className="text-xs text-muted-foreground">{hint}</CardContent>}
  </Card>
);

const pct = (part: number, whole: number) =>
  whole ? `${((part / whole) * 100).toFixed(1)}%` : "—";

export const CommunicationsOverviewPage: React.FC = () => {
  const { data, isLoading } = useCommsOverviewQuery(30);
  const approvals = useBroadcastsQuery({ page: 1, limit: 5, status: "awaiting_approval" });
  const recent = useBroadcastsQuery({ page: 1, limit: 5 });
  const all = totals(data?.messages);

  return (
    <PageLayout
      title="Communications"
      subtitle="Announcements and marketing to customers and staff, and the health of everything we send."
      actionButton={
        <Button nativeButton={false} render={<Link href="/admin/communications/new" />}>
          New broadcast
        </Button>
      }
    >
      {isLoading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="Broadcasts sent (30 days)" value={data.broadcasts_sent.toLocaleString()} />
          <Kpi
            label="Messages sent (30 days)"
            value={all.sent.toLocaleString()}
            hint={`${pct(all.sent, all.total)} of ${all.total.toLocaleString()} attempted`}
          />
          <Kpi
            label="Failed (30 days)"
            value={all.failed.toLocaleString()}
            hint={all.failed ? "See the delivery log for reasons" : "Nothing failed"}
          />
          <Kpi
            label="Awaiting approval"
            value={data.awaiting_approval.toLocaleString()}
            hint={`Marketing to more than ${data.approval_threshold.toLocaleString()} people needs a second approver`}
          />
        </div>
      )}

      {data && Object.keys(data.messages).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>By channel, last 30 days</CardTitle>
            <CardDescription>
              Sent means the provider accepted the message. Delivery and open tracking arrive in a
              later release.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-3">
              {(Object.keys(data.messages) as Channel[]).map((channel) => {
                const t = totals({ [channel]: data.messages[channel] });
                return (
                  <div key={channel} className="rounded-lg border border-border p-4">
                    <dt className="text-sm text-muted-foreground">{CHANNEL_LABELS[channel]}</dt>
                    <dd className="text-xl font-semibold tabular-nums">
                      {t.sent.toLocaleString()} sent
                    </dd>
                    <dd className="text-xs text-muted-foreground">
                      {pct(t.sent, t.total)} success · {t.failed.toLocaleString()} failed
                      {t.pending ? ` · ${t.pending.toLocaleString()} pending` : ""}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Waiting for your approval</CardTitle>
            <CardDescription>You can't approve your own broadcasts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {approvals.data?.items.length ? (
              approvals.data.items.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/communications/broadcasts?open=${b.id}`}
                  className="flex items-center justify-between gap-3 rounded-md border border-border p-3 hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{b.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.recipients_count.toLocaleString()} people · by {b.created_by ?? "unknown"}
                    </p>
                  </div>
                  <span className="text-sm text-primary shrink-0">Review</span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nothing is waiting.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent broadcasts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.data?.items.length ? (
              recent.data.items.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/communications/broadcasts?open=${b.id}`}
                  className="flex items-center justify-between gap-3 rounded-md border border-border p-3 hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{b.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {shortDate(b.created_at)} · <DeliverySummary counts={b.stats.channels} />
                    </p>
                  </div>
                  <BroadcastStatusBadge status={b.status} />
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No broadcasts yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};
