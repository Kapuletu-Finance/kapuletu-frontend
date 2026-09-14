"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuditLogsQuery } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import PageLayout from "@/features/shared/components/PageLayout";
import { AuditLogTable } from "./AuditLogTable";

export const AdminAuditPage: React.FC = () => {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  // Derive filters from category
  let entity_type: string | undefined;
  let action: string | undefined;

  if (category === "system_tasks") {
    entity_type = "system";
  } else if (category === "errors") {
    entity_type = "system";
    action = "server_crash";
  } else if (category === "business") {
    // If not system, it's business logic
    // We can't strictly exclude 'system' via simple params, but we could just leave it wide open or filter client side.
    // Let's just pass undefined for now.
  }

  const { data, isLoading, isError, error } = useAuditLogsQuery({
    q: q || undefined,
    entity_type,
    action,
    page,
    limit: 50,
  });

  const logs = data?.logs || [];

  // Client-side filtering for 'business' since API doesn't support 'not equal'
  const filteredLogs =
    category === "business" ? logs.filter((l) => l.entity_type !== "system") : logs;

  return (
    <PageLayout title="System & Audit Logs">
      <p className="text-sm text-muted-foreground mt-2">
        Comprehensive observability into business actions, system tasks, and critical errors.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <IconLibrary
              name="search"
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search logs, actors, or payloads..."
              className="pl-8 bg-background"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={category}
            onValueChange={(val) => {
              setCategory(val || "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Logs</SelectItem>
              <SelectItem value="business">Business Activity</SelectItem>
              <SelectItem value="system_tasks">System Tasks</SelectItem>
              <SelectItem value="errors">Critical Errors</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isError ? (
        <div className="flex h-32 items-center justify-center rounded-md border border-destructive/50 bg-destructive/10 mt-4 text-destructive">
          Failed to load audit logs: {error?.message}
        </div>
      ) : (
        <AuditLogTable logs={filteredLogs} isLoading={isLoading} />
      )}

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing page {page} {data?.total ? `of ${Math.ceil(data.total / 50)}` : ""}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!data || data.logs.length < 50 || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};
