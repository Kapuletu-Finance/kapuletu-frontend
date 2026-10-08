"use client";

import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
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
import { VenueSelect } from "@/features/hr/components/admin/locations/VenueSelect";
import { WorkModeBadge } from "@/features/hr/components/shared/HrBadges";
import { PeriodNavigator } from "@/features/hr/components/shared/PeriodNavigator";
import { SegmentedControl } from "@/features/hr/components/shared/SegmentedControl";
import { useEmployeeOptions } from "@/features/hr/hooks/useEmployeeOptions";
import {
  useDeleteOverrideMutation,
  useUpsertOverrideMutation,
} from "@/features/hr/services/mutations";
import { useScheduleOverridesQuery } from "@/features/hr/services/queries";
import type { DayMode } from "@/features/hr/types";
import { DAY_MODE_LABELS, monthRange, parseDateParam, toDateParam } from "@/features/hr/utils";

const EVERYONE = "everyone";
const MODE_OPTIONS = (["off", "physical", "online"] as const).map((mode) => ({
  label: DAY_MODE_LABELS[mode],
  value: mode,
}));

export const ScheduleOverridesCard: React.FC = () => {
  const [month, setMonth] = useState(() => new Date());
  const range = useMemo(() => monthRange(month), [month]);
  const { data: overrides, isLoading } = useScheduleOverridesQuery(range);
  const employeeOptions = useEmployeeOptions();
  const upsertMutation = useUpsertOverrideMutation();
  const deleteMutation = useDeleteOverrideMutation();

  const [date, setDate] = useState<Date | undefined>();
  const [target, setTarget] = useState<string>(EVERYONE);
  const [mode, setMode] = useState<DayMode>("off");
  const [reason, setReason] = useState("");
  const [venueId, setVenueId] = useState<string | null>(null);

  const targetItems = useMemo(
    () => ({ [EVERYONE]: "Everyone", ...employeeOptions }),
    [employeeOptions],
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    upsertMutation.mutate(
      {
        date: toDateParam(date),
        mode,
        location_id: mode === "physical" ? (venueId ?? undefined) : undefined,
        reason: reason.trim() || undefined,
        user_id: target === EVERYONE ? undefined : target,
      },
      {
        onSuccess: () => {
          setReason("");
          setDate(undefined);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date overrides</CardTitle>
        <CardDescription>
          Holidays, special office days or one-off changes. An employee&apos;s own override wins
          over one for everyone; both win over weekly patterns.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form
          onSubmit={handleAdd}
          className="grid gap-3 rounded-lg border bg-muted/20 p-3 lg:grid-cols-4"
        >
          <div className="space-y-1.5">
            <Label>Date</Label>
            <DatePicker date={date} setDate={setDate} />
          </div>
          <div className="space-y-1.5">
            <Label>Applies to</Label>
            <Select
              items={targetItems}
              value={target}
              onValueChange={(v) => setTarget(v ?? EVERYONE)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(targetItems).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Day becomes</Label>
            <SegmentedControl
              className="flex w-full"
              options={MODE_OPTIONS}
              value={mode}
              onChange={setMode}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="override-reason">Reason</Label>
            <Input
              id="override-reason"
              maxLength={200}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Mashujaa Day"
            />
          </div>
          {mode === "physical" && (
            <div className="space-y-1.5 lg:col-span-2">
              <Label htmlFor="override-venue">Venue</Label>
              <VenueSelect id="override-venue" value={venueId} onChange={setVenueId} />
            </div>
          )}
          <div className="flex items-end justify-end lg:col-span-4">
            <Button type="submit" disabled={!date || upsertMutation.isPending}>
              {upsertMutation.isPending ? "Saving..." : "Add override"}
            </Button>
          </div>
        </form>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Overrides this month</p>
          <PeriodNavigator period="month" date={month} onChange={setMonth} />
        </div>

        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : !overrides?.length ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No overrides in this month.
          </p>
        ) : (
          <div className="divide-y rounded-lg border">
            {overrides.map((override) => (
              <div
                key={override.id}
                className="flex min-w-0 flex-col gap-2 p-3 sm:flex-row sm:items-center sm:gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="w-28 shrink-0 text-sm font-medium">
                    {format(parseDateParam(override.date), "EEE d MMM")}
                  </div>
                  <WorkModeBadge mode={override.mode} />
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <span className="font-medium">{override.employee_name ?? "Everyone"}</span>
                  {override.mode === "physical" && (
                    <span className="text-muted-foreground">
                      {" "}
                      · at {override.location_name ?? "the default location"}
                    </span>
                  )}
                  {override.reason && (
                    <span className="text-muted-foreground"> · {override.reason}</span>
                  )}
                </div>
                <div className="flex justify-end sm:shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remove override"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(override.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
