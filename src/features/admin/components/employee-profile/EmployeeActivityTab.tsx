"use client";

import { History, Search } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type ActivityView,
  useEmployeeActivityQuery,
} from "@/features/admin/services/employeeProfile";
import { SegmentedControl } from "@/features/hr/components/shared/SegmentedControl";
import { timeAgo } from "@/features/notifications/utils";
import Pagination from "@/features/shared/components/Pagination";

const VIEWS: { value: ActivityView; label: string; description: string }[] = [
  {
    description: "Actions this employee took on the platform.",
    label: "Their actions",
    value: "performed",
  },
  {
    description:
      "Changes others made to this employee: access, account status, attendance corrections.",
    label: "Changes to them",
    value: "received",
  },
  { description: "Every successful sign-in.", label: "Sign-ins", value: "logins" },
];

const SEARCH_DEBOUNCE_MS = 300;

export const EmployeeActivityTab: React.FC<{ userId: string }> = ({ userId }) => {
  const [view, setView] = useState<ActivityView>("performed");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useEmployeeActivityQuery(userId, view, query, page);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;
  const current = VIEWS.find((v) => v.value === view);

  return (
    <Card>
      <CardHeader className="gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" /> Activity
          </CardTitle>
          <CardDescription>{current?.description}</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl
            options={VIEWS}
            value={view}
            onChange={(next) => {
              setView(next);
              setPage(1);
            }}
          />
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search activity"
              className="h-9 w-48 pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading || !data ? (
          <Skeleton className="h-64 w-full" />
        ) : data.items.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {query ? "No activity matches your search." : "No activity recorded yet."}
          </p>
        ) : (
          <ol className={isFetching ? "divide-y opacity-60" : "divide-y"}>
            {data.items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.message}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-mono">{item.action}</span>
                    {view === "received" && item.actor_name ? ` · by ${item.actor_name}` : ""}
                  </p>
                </div>
                <time
                  dateTime={item.at}
                  title={new Date(item.at).toLocaleString()}
                  className="shrink-0 text-xs text-muted-foreground"
                >
                  {timeAgo(item.at)} · {new Date(item.at).toLocaleString()}
                </time>
              </li>
            ))}
          </ol>
        )}
        {data && data.total > data.limit && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        )}
        {data && <p className="text-xs text-muted-foreground">{data.total} entries</p>}
      </CardContent>
    </Card>
  );
};
