"use client";

import { Search } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminEmployeesQuery } from "@/features/admin/services/queries";
import { SegmentedControl } from "@/features/hr/components/shared/SegmentedControl";
import type { MeetingAudience } from "@/features/hr/types";
import { formatRole } from "@/features/hr/utils";
import { cn } from "@/lib/utils";

export interface AudienceValue {
  audience: MeetingAudience;
  audience_roles: string[];
  attendee_ids: string[];
}

interface AudienceSelectorProps {
  value: AudienceValue;
  onChange: (value: AudienceValue) => void;
}

const toggle = (list: string[], item: string) =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

const AUDIENCE_OPTIONS: { value: MeetingAudience; label: string }[] = [
  { label: "All employees", value: "all" },
  { label: "By role", value: "roles" },
  { label: "Specific people", value: "custom" },
];

/** Chooses who is invited: everyone, everyone in selected roles, or a hand-picked list. */
export const AudienceSelector: React.FC<AudienceSelectorProps> = ({ value, onChange }) => {
  const { data, isLoading } = useAdminEmployeesQuery();
  const [search, setSearch] = useState("");

  const employees = useMemo(() => (data ?? []).filter((e) => e.is_active), [data]);
  const roleCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of employees) counts.set(e.role, (counts.get(e.role) ?? 0) + 1);
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [employees]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? employees.filter((e) =>
          `${e.first_name} ${e.last_name} ${e.email} ${e.role}`.toLowerCase().includes(q),
        )
      : employees;
  }, [employees, search]);

  const inviteeCount =
    value.audience === "all"
      ? employees.length
      : value.audience === "roles"
        ? employees.filter((e) => value.audience_roles.includes(e.role)).length
        : value.attendee_ids.length;

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="space-y-3">
      <SegmentedControl
        className="flex w-full"
        options={AUDIENCE_OPTIONS}
        value={value.audience}
        onChange={(audience) => onChange({ ...value, audience })}
      />

      {value.audience === "roles" && (
        <div className="flex flex-wrap gap-2">
          {roleCounts.map(([role, count]) => {
            const selected = value.audience_roles.includes(role);
            return (
              <button
                key={role}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  onChange({ ...value, audience_roles: toggle(value.audience_roles, role) })
                }
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors",
                  selected
                    ? "border-primary bg-primary/10 text-primary"
                    : "text-muted-foreground hover:border-foreground/30",
                )}
              >
                {formatRole(role)} <span className="opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {value.audience === "custom" && (
        <div className="rounded-lg border">
          <div className="flex items-center gap-2 border-b p-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or role"
              className="h-8 border-0 shadow-none focus-visible:ring-0"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                onChange({
                  ...value,
                  attendee_ids: [
                    ...new Set([...value.attendee_ids, ...filtered.map((e) => e.user_id)]),
                  ],
                })
              }
            >
              Select all
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange({ ...value, attendee_ids: [] })}
            >
              Clear
            </Button>
          </div>
          <ScrollArea className="h-52">
            <div className="divide-y">
              {filtered.map((employee) => (
                <div
                  key={employee.user_id}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-muted/40"
                >
                  <Checkbox
                    id={`attendee-${employee.user_id}`}
                    checked={value.attendee_ids.includes(employee.user_id)}
                    onCheckedChange={() =>
                      onChange({
                        ...value,
                        attendee_ids: toggle(value.attendee_ids, employee.user_id),
                      })
                    }
                  />
                  <label
                    htmlFor={`attendee-${employee.user_id}`}
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {employee.first_name} {employee.last_name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {employee.email}
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRole(employee.role)}
                    </span>
                  </label>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="p-4 text-center text-sm text-muted-foreground">No employees found.</p>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{inviteeCount}</span>{" "}
        {inviteeCount === 1 ? "person" : "people"} will be invited and notified by email and in-app.
      </p>
    </div>
  );
};
