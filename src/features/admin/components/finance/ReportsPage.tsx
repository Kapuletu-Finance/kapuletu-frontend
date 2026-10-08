"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BillingRulesTab } from "@/features/admin/components/settings/tabs/BillingRulesTab";
import {
  type ReportFormat,
  type ReportKey,
  useCreateScheduleMutation,
  useDeleteScheduleMutation,
  useDownloadReportMutation,
  useReportCatalogueQuery,
  useReportQuery,
  useReportSchedulesQuery,
  useSendScheduleNowMutation,
  useUpdateScheduleMutation,
} from "@/features/admin/services/financeOpsApi";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { cn } from "@/lib/utils";
import { ExportModal } from "./ExportModal";
import { dateTime, presetRange, RANGE_PRESETS, type RangePreset } from "./shared";

const LAST_MONTH = "last_full_month";
const FORMATS: { value: ReportFormat; label: string }[] = [
  { value: "pdf", label: "Official PDF" },
  { value: "excel", label: "Excel" },
  { value: "csv", label: "CSV" },
];

const ReportPreview = ({
  reportKey,
  range,
}: {
  reportKey: ReportKey;
  range: { from?: string; to?: string };
}) => {
  const { data, isLoading, isFetching } = useReportQuery(reportKey, range.from, range.to);
  const download = useDownloadReportMutation();

  if (isLoading || !data) return <Skeleton className="h-64 w-full" />;

  return (
    <Card className={cn(isFetching && "opacity-70")}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>{data.title}</CardTitle>
          <CardDescription>
            {data.period.label}. {data.description}
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {FORMATS.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={f.value === "pdf" ? "default" : "outline"}
              disabled={download.isPending}
              onClick={() => download.mutate({ key: reportKey, format: f.value, ...range })}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.figures.length > 0 && (
          <dl className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {data.figures.map((f) => (
              <div key={f.label} className="rounded-md border border-border p-3">
                <dt className="text-xs text-muted-foreground">{f.label}</dt>
                <dd className="text-lg font-semibold tabular-nums">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {data.tables.map((t) => (
          <section key={t.title} className="space-y-2">
            <h3 className="text-sm font-semibold">{t.title}</h3>
            <div className="rounded-md border border-border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {t.columns.map((c, i) => (
                      <TableHead key={c} className={cn(t.numeric_cols.includes(i) && "text-right")}>
                        {c}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {t.rows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={t.columns.length}
                        className="text-center text-muted-foreground h-16"
                      >
                        Nothing in this period.
                      </TableCell>
                    </TableRow>
                  ) : (
                    t.rows.map((row, r) => (
                      <TableRow
                        // biome-ignore lint/suspicious/noArrayIndexKey: report rows have no id and never reorder
                        key={r}
                        className={cn(row[0] === "Total" && "font-semibold")}
                      >
                        {row.map((cell, i) => (
                          <TableCell
                            // biome-ignore lint/suspicious/noArrayIndexKey: fixed column positions
                            key={i}
                            className={cn(t.numeric_cols.includes(i) && "text-right tabular-nums")}
                          >
                            {typeof cell === "number" && !Number.isInteger(cell)
                              ? cell.toLocaleString("en-KE", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : typeof cell === "number"
                                ? cell.toLocaleString("en-KE")
                                : cell}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        ))}
      </CardContent>
    </Card>
  );
};

const ScheduleDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { data: catalogue } = useReportCatalogueQuery();
  const create = useCreateScheduleMutation();
  const [reportType, setReportType] = useState<ReportKey>("revenue");
  const [frequency, setFrequency] = useState("monthly");
  const [format, setFormat] = useState<ReportFormat>("pdf");
  const [recipients, setRecipients] = useState("");
  const emails = recipients
    .split(/[\s,;]+/)
    .map((e) => e.trim())
    .filter(Boolean);
  const valid = emails.length > 0 && emails.every((e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule a report</DialogTitle>
          <DialogDescription>
            Emailed with the report attached: weekly on Mondays (previous Monday to Sunday) or
            monthly on the 1st (previous month).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Report</Label>
            <Select value={reportType} onValueChange={(v) => v && setReportType(v as ReportKey)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {catalogue?.map((r) => (
                  <SelectItem key={r.key} value={r.key}>
                    {r.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>How often</Label>
              <Select value={frequency} onValueChange={(v) => v && setFrequency(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={format} onValueChange={(v) => v && setFormat(v as ReportFormat)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FORMATS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="schedule-recipients">Send to</Label>
            <Input
              id="schedule-recipients"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="cfo@kapuletu.co.ke, accounts@kapuletu.co.ke"
              aria-invalid={recipients !== "" && !valid}
            />
            <p className="text-xs text-muted-foreground">
              Separate addresses with commas. Up to 20.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            disabled={!valid || create.isPending}
            onClick={() =>
              create.mutate(
                { report_type: reportType, frequency, format, recipients: emails },
                {
                  onSuccess: () => {
                    setRecipients("");
                    onClose();
                  },
                },
              )
            }
          >
            {create.isPending ? "Saving…" : "Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Schedules = () => {
  const { data: schedules, isLoading } = useReportSchedulesQuery();
  const { data: catalogue } = useReportCatalogueQuery();
  const update = useUpdateScheduleMutation();
  const remove = useDeleteScheduleMutation();
  const sendNow = useSendScheduleNowMutation();
  const [open, setOpen] = useState(false);
  const title = (key: string) => catalogue?.find((c) => c.key === key)?.title ?? key;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Scheduled emails</h2>
          <p className="text-sm text-muted-foreground">
            Checked every morning; each period is sent once.
          </p>
        </div>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Schedule a report
        </Button>
      </div>
      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Last sent</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Skeleton className="h-10 w-full" />
                </TableCell>
              </TableRow>
            ) : !schedules?.length ? (
              <TableRow>
                <TableCell colSpan={6} className="h-16 text-center text-sm text-muted-foreground">
                  No reports are scheduled.
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((s) => (
                <TableRow key={s.schedule_id}>
                  <TableCell className="font-medium">{title(s.report_type)}</TableCell>
                  <TableCell>
                    {s.frequency === "monthly" ? "Monthly" : "Weekly"} · {s.format.toUpperCase()}
                  </TableCell>
                  <TableCell className="max-w-64 truncate" title={s.recipients.join(", ")}>
                    {s.recipients.join(", ")}
                  </TableCell>
                  <TableCell>
                    {s.last_sent_at ? dateTime(s.last_sent_at) : "Not yet"}
                    {s.last_error && (
                      <Badge variant="destructive" className="ml-2" title={s.last_error}>
                        Failed
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={s.is_active}
                      aria-label={`${title(s.report_type)} schedule active`}
                      onCheckedChange={(checked) =>
                        update.mutate({ id: s.schedule_id, is_active: checked })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={sendNow.isPending}
                      onClick={() => sendNow.mutate(s.schedule_id)}
                    >
                      Send now
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() =>
                        confirm("Stop sending this report?") && remove.mutate(s.schedule_id)
                      }
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <ScheduleDialog open={open} onClose={() => setOpen(false)} />
    </section>
  );
};

export const ReportsPage: React.FC = () => {
  const { data: catalogue } = useReportCatalogueQuery();
  const [reportKey, setReportKey] = useState<ReportKey>("revenue");
  const [period, setPeriod] = useState<string>(LAST_MONTH);
  const [exportOpen, setExportOpen] = useState(false);
  // No bounds = the API's default, the last full calendar month.
  const range = useMemo(
    () => (period === LAST_MONTH ? {} : presetRange(period as RangePreset)),
    [period],
  );

  return (
    <PageLayout
      title="Reports"
      subtitle="Preview on screen, then download as an official PDF, Excel or CSV, or have it emailed on a schedule."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" role="group" aria-label="Report">
        {catalogue?.map((r) => (
          <button
            key={r.key}
            type="button"
            aria-pressed={reportKey === r.key}
            onClick={() => setReportKey(r.key)}
            className={cn(
              "rounded-lg border p-3 text-left transition-colors",
              reportKey === r.key
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted/50",
            )}
          >
            <span className="block text-sm font-semibold">{r.title}</span>
            <span className="block text-xs text-muted-foreground mt-1">{r.description}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Label className="shrink-0">Period</Label>
        <Select value={period} onValueChange={(v) => v && setPeriod(v)}>
          <SelectTrigger className="w-48" aria-label="Period">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={LAST_MONTH}>Last full month</SelectItem>
            {RANGE_PRESETS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="link" onClick={() => setExportOpen(true)}>
          Raw payments export
        </Button>
      </div>

      <ReportPreview reportKey={reportKey} range={range} />
      <Schedules />
      <ExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} />
    </PageLayout>
  );
};

export const BillingRulesPage: React.FC = () => (
  <PageLayout
    title="Billing rules"
    subtitle="Trial length, grace period, annual discount, add-on price and tax."
  >
    <BillingRulesTab />
  </PageLayout>
);
