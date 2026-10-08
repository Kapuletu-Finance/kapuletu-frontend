"use client";

import { format, parseISO } from "date-fns";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type Channel,
  type CommsOverview,
  type Engagement,
  useMessageEventsQuery,
} from "@/features/admin/services/communicationsApi";
import { CHANNEL_LABELS, dateTime, MessageStatusBadge, pct } from "./shared";

/*
 * Delivery outcome colours are status colours (validated for colour-blind separation on both themes):
 * delivered = good, failed = critical, not yet confirmed = neutral grey. Text never takes these colours.
 */
const OUTCOME_VARS =
  "[--outcome-delivered:#0ca30c] [--outcome-pending:#a8a8a3] [--outcome-failed:#d03b3b] dark:[--outcome-pending:#8c8c87]";

const OUTCOMES = [
  { key: "delivered", label: "Delivered", color: "var(--outcome-delivered)" },
  { key: "pending", label: "Not yet confirmed", color: "var(--outcome-pending)" },
  { key: "failed", label: "Failed or bounced", color: "var(--outcome-failed)" },
] as const;

type DayRow = {
  date: string;
  delivered: number;
  pending: number;
  failed: number;
  attempted: number;
};

const Swatch = ({ color }: { color: string }) => (
  <span
    aria-hidden
    className="inline-block size-2.5 rounded-sm shrink-0"
    style={{ background: color }}
  />
);

const TrendTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: DayRow }[];
}) => {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md space-y-1">
      <p className="font-medium text-foreground">{format(parseISO(row.date), "EEE d MMM")}</p>
      {OUTCOMES.map((o) => (
        <p key={o.key} className="flex items-center gap-2 text-muted-foreground">
          <Swatch color={o.color} />
          <span>{o.label}</span>
          <span className="ml-auto pl-4 tabular-nums text-foreground">
            {row[o.key].toLocaleString()}
          </span>
        </p>
      ))}
    </div>
  );
};

/** Messages handed to email and WhatsApp providers per day, split by what happened to them. */
export const DeliveryTrendChart = ({ daily }: { daily: CommsOverview["daily"] }) => {
  const [asTable, setAsTable] = useState(false);
  const rows: DayRow[] = daily.map((d) => ({
    ...d,
    pending: Math.max(0, d.attempted - d.delivered - d.failed),
  }));
  const empty = rows.every((r) => !r.attempted);

  return (
    <Card className={OUTCOME_VARS}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Email and WhatsApp, day by day</CardTitle>
          <CardDescription>
            Messages sent each day (Nairobi time) and what happened to them.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAsTable(!asTable)}
          aria-pressed={asTable}
        >
          {asTable ? "Show chart" : "Show table"}
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3" aria-label="Legend">
          {OUTCOMES.map((o) => (
            <li key={o.key} className="flex items-center gap-1.5">
              <Swatch color={o.color} />
              {o.label}
            </li>
          ))}
        </ul>
        {empty ? (
          <p className="text-sm text-muted-foreground py-10 text-center">
            Nothing sent in this period.
          </p>
        ) : asTable ? (
          <div className="max-h-72 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground text-left">
                <tr>
                  <th className="py-1 font-medium">Day</th>
                  {OUTCOMES.map((o) => (
                    <th key={o.key} className="py-1 font-medium text-right">
                      {o.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {rows
                  .filter((r) => r.attempted)
                  .map((r) => (
                    <tr key={r.date} className="border-t border-border">
                      <td className="py-1">{format(parseISO(r.date), "d MMM")}</td>
                      <td className="py-1 text-right">{r.delivered.toLocaleString()}</td>
                      <td className="py-1 text-right">{r.pending.toLocaleString()}</td>
                      <td className="py-1 text-right">{r.failed.toLocaleString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            className="h-64"
            role="img"
            aria-label="Daily messages sent by outcome; use Show table for values"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rows}
                barCategoryGap={2}
                margin={{ top: 4, right: 4, left: -12, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.6} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d: string) => format(parseISO(d), "d MMM")}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={24}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => v.toLocaleString()}
                />
                <Tooltip
                  content={<TrendTooltip />}
                  cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                />
                {OUTCOMES.map((o, i) => (
                  <Bar
                    key={o.key}
                    dataKey={o.key}
                    stackId="outcome"
                    fill={o.color}
                    // The card colour between segments is the 2px gap that separates them
                    stroke="var(--card)"
                    strokeWidth={2}
                    radius={i === OUTCOMES.length - 1 ? [4, 4, 0, 0] : 0}
                    isAnimationActive={false}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- deliverability rates ---

/** Industry guardrails: Gmail/Yahoo start filtering bulk senders above these. */
const LIMITS = { bounced: 0.02, complained: 0.001 };

const Rate = ({
  label,
  part,
  whole,
  limit,
  hint,
}: {
  label: string;
  part: number;
  whole: number;
  limit?: number;
  hint?: string;
}) => {
  const over = limit !== undefined && whole > 0 && part / whole > limit;
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <dt className="text-muted-foreground">
        {label}
        {hint && <span className="block text-xs">{hint}</span>}
      </dt>
      <dd className="text-right tabular-nums">
        <span className="font-medium">{pct(part, whole)}</span>
        <span className="text-xs text-muted-foreground"> ({part.toLocaleString()})</span>
        {limit !== undefined && whole > 0 && (
          <span className="flex items-center justify-end gap-1 text-xs">
            {over ? (
              <>
                <AlertTriangle className="size-3 text-[#d03b3b]" aria-hidden />
                <span>Above {(limit * 100).toFixed(1)}%</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-3 text-[#0ca30c]" aria-hidden />
                <span>Healthy</span>
              </>
            )}
          </span>
        )}
      </dd>
    </div>
  );
};

export const DeliverabilityCards = ({ data }: { data: CommsOverview }) => {
  const channels = (["email", "whatsapp"] as const).filter(
    (c) => data.deliverability[c]?.attempted,
  );
  if (!channels.length) return null;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {channels.map((c) => {
        const r = data.deliverability[c];
        if (!r) return null;
        const tracked = data.tracking[c];
        return (
          <Card key={c}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{CHANNEL_LABELS[c]} deliverability</CardTitle>
              <CardDescription>
                {r.attempted.toLocaleString()} sent in the last {data.period_days} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!tracked ? (
                <p className="text-sm text-muted-foreground">
                  No delivery reports received yet.{" "}
                  {c === "email"
                    ? "Add the Resend webhook (RESEND_WEBHOOK_SECRET) to see deliveries, bounces, opens and clicks."
                    : "Set META_APP_SECRET so WhatsApp delivery and read receipts can be verified and recorded."}
                </p>
              ) : (
                <dl className="space-y-2">
                  <Rate label="Delivered" part={r.delivered} whole={r.attempted} />
                  <Rate
                    label={c === "email" ? "Opened" : "Read"}
                    part={r.opened}
                    whole={r.delivered}
                    hint={
                      c === "email"
                        ? "Of delivered; some mail apps open everything"
                        : "Of delivered"
                    }
                  />
                  {c === "email" && (
                    <Rate
                      label="Clicked"
                      part={r.clicked}
                      whole={r.delivered}
                      hint="Of delivered"
                    />
                  )}
                  {c === "email" ? (
                    <>
                      <Rate
                        label="Bounced"
                        part={r.bounced}
                        whole={r.attempted}
                        limit={LIMITS.bounced}
                      />
                      <Rate
                        label="Marked as spam"
                        part={r.complained}
                        whole={r.delivered}
                        limit={LIMITS.complained}
                      />
                    </>
                  ) : (
                    <Rate label="Failed" part={r.failed} whole={r.attempted} />
                  )}
                </dl>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// --- per-broadcast funnel ---

export const ChannelFunnel = ({
  channel,
  sent,
  engagement,
}: {
  channel: Channel;
  sent: number;
  engagement?: Engagement;
}) => {
  if (channel === "in_app" || !engagement || !sent) return null;
  const steps = [
    { label: "Sent", value: sent, of: sent },
    { label: "Delivered", value: engagement.delivered, of: sent },
    {
      label: channel === "email" ? "Opened" : "Read",
      value: engagement.opened,
      of: engagement.delivered,
    },
    ...(channel === "email"
      ? [{ label: "Clicked", value: engagement.clicked, of: engagement.delivered }]
      : []),
  ];
  return (
    <ol className="space-y-1 mt-2" aria-label={`${CHANNEL_LABELS[channel]} funnel`}>
      {steps.map((s) => (
        <li key={s.label} className="text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{s.label}</span>
            <span className="tabular-nums">
              {s.value.toLocaleString()}
              {s.label !== "Sent" && (
                <span className="text-muted-foreground"> · {pct(s.value, s.of)}</span>
              )}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${sent ? Math.min(100, (s.value / sent) * 100) : 0}%` }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
};

// --- one message's history ---

const EVENT_LABELS: Record<string, string> = {
  sent: "Accepted by provider",
  delivered: "Delivered",
  delayed: "Delivery delayed",
  soft_bounced: "Temporary bounce",
  bounced: "Bounced",
  complained: "Marked as spam",
  opened: "Opened",
  clicked: "Clicked a link",
  failed: "Failed",
};

export const MessageTimelineDialog = ({
  id,
  onClose,
}: {
  id: string | null;
  onClose: () => void;
}) => {
  const { data, isLoading } = useMessageEventsQuery(id);
  const m = data?.message;
  const read = m?.channel === "whatsapp";
  return (
    <Dialog open={!!id} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m ? m.recipient : "Message"}</DialogTitle>
          <DialogDescription>
            {m
              ? `${CHANNEL_LABELS[m.channel] ?? m.channel.toUpperCase()} to ${m.destination}${m.subject ? ` · ${m.subject}` : ""}`
              : "Loading…"}
          </DialogDescription>
        </DialogHeader>
        {isLoading || !m ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageStatusBadge status={m.status} />
              {m.error && <span className="text-xs text-destructive break-words">{m.error}</span>}
            </div>
            <ol className="relative border-l border-border ml-1.5 space-y-3">
              <li className="pl-4">
                <p className="text-sm">Queued</p>
                <p className="text-xs text-muted-foreground">{dateTime(m.created_at)}</p>
              </li>
              {m.sent_at && (
                <li className="pl-4">
                  <p className="text-sm">
                    Handed to provider{m.attempts > 1 ? ` (attempt ${m.attempts})` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">{dateTime(m.sent_at)}</p>
                </li>
              )}
              {data.events
                .filter((e) => e.event !== "sent")
                .map((e, i) => (
                  <li key={`${e.event}-${i}`} className="pl-4">
                    <p className="text-sm">
                      {e.event === "opened" && read ? "Read" : (EVENT_LABELS[e.event] ?? e.event)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dateTime(e.occurred_at)}
                      {e.detail && <span className="block break-all">{e.detail}</span>}
                    </p>
                  </li>
                ))}
            </ol>
            {!data.events.length && m.sent_at && m.channel !== "in_app" && (
              <p className="text-xs text-muted-foreground">
                No delivery reports for this message yet. They appear once provider webhooks are
                connected.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
