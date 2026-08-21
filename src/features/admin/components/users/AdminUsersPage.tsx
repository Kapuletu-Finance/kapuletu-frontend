"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminUsersQuery } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { AdminUsersTable } from "./AdminUsersTable";

export const AdminUsersPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  });

  const { data, isLoading, isError, refetch } = useAdminUsersQuery({
    page,
    limit: 10,
    status: status !== "all" ? status : undefined,
    q: debouncedSearch || undefined,
  });

  if (isError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4 rounded-lg border border-dashed border-border p-8 text-center">
        <IconLibrary name="alert" className="size-8 text-destructive/80" />
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-foreground">Failed to load users</h3>
          <p className="text-sm text-muted-foreground">
            There was an error connecting to the user management service.
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <IconLibrary name="refresh" className="mr-2 size-4" />
          Try Again
        </Button>
      </div>
    );
  }

  const handleRowClick = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-lg font-semibold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage platform treasurers, suspend accounts, and override plans.
        </p>
      </div>

      {data?.kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <IconLibrary name="users" className="h-4 w-4" />
              <span className="text-sm font-medium">Total Users</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{data.kpis.total}</span>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <IconLibrary name="check-circle" className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium">Active Users</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{data.kpis.active}</span>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <IconLibrary name="alert" className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">Suspended</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{data.kpis.suspended}</span>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <IconLibrary name="analytics" className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">New This Month</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{data.kpis.new_this_month}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <IconLibrary
              name="search"
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search by name or email..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={status}
            onValueChange={(val) => {
              setStatus(val || "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {data ? `${data.total} users found` : "Loading..."}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <AdminUsersTable
          users={data?.users || []}
          isLoading={isLoading}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Pagination Controls */}
      {data && data.total > 0 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * data.limit + 1} to {Math.min(page * data.limit, data.total)} of{" "}
            {data.total}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
