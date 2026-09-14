"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedbackTable } from "@/features/admin/components/feedback/FeedbackTable";
import {
  type AdminFeedbackFilters,
  useAdminFeedbackQuery,
} from "@/features/admin/services/queries";

const FEEDBACK_TYPE_OPTIONS = [
  { value: "bug", label: "Bug Report" },
  { value: "feature_request", label: "Feature Request" },
  { value: "ux_issue", label: "UI / UX Issue" },
  { value: "performance", label: "Performance" },
  { value: "general", label: "General" },
];

const SEVERITY_OPTIONS = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "shipped", label: "Shipped" },
  { value: "declined", label: "Declined" },
];

export const AdminFeedbackPage: React.FC = () => {
  const [filters, setFilters] = useState<AdminFeedbackFilters>({ page: 1, limit: 50 });
  const router = useRouter();

  const { data, isLoading } = useAdminFeedbackQuery(filters);

  const setFilter = (key: keyof AdminFeedbackFilters, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 1 }));
  };

  const clearFilters = () => setFilters({ page: 1, limit: 50 });

  const hasActiveFilters =
    filters.feedback_type || filters.app_area || filters.severity || filters.status;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">User Feedback</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-24 inline-block" />
            ) : (
              `${data?.total ?? 0} submissions`
            )}
          </p>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.feedback_type ?? ""}
          onValueChange={(v) => setFilter("feedback_type", v || undefined)}
        >
          <SelectTrigger className="h-8 w-[150px] text-xs" id="filter-type">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            {FEEDBACK_TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.severity ?? ""}
          onValueChange={(v) => setFilter("severity", v || undefined)}
        >
          <SelectTrigger className="h-8 w-[130px] text-xs" id="filter-severity">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Severities</SelectItem>
            {SEVERITY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status ?? ""}
          onValueChange={(v) => setFilter("status", v || undefined)}
        >
          <SelectTrigger className="h-8 w-[140px] text-xs" id="filter-status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Badge variant="secondary" className="h-8 px-3 text-xs">
            Filtered
          </Badge>
        )}
      </div>

      {/* Table */}
      <FeedbackTable
        items={data?.items ?? []}
        isLoading={isLoading}
        onSelect={(item) => router.push(`/admin/feedback/${item.feedback_id}`)}
        currentPage={filters.page ?? 1}
        totalPages={data?.pages ?? 1}
        onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
      />
    </div>
  );
};
