"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type BroadcastStatus,
  useBroadcastsQuery,
} from "@/features/admin/services/communicationsApi";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { BroadcastDetailSheet } from "./BroadcastDetailSheet";
import {
  audienceLabel,
  BROADCAST_STATUSES,
  BroadcastStatusBadge,
  CategoryBadge,
  CHANNEL_LABELS,
  DeliverySummary,
  dateTime,
  EmptyRow,
  FilterSelect,
  Pagination,
  useDebouncedValue,
} from "./shared";

const LIMIT = 25;
const clickableRow = "cursor-pointer hover:bg-muted/50 focus-visible:bg-muted/50 outline-none";

export const BroadcastsPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const openId = params.get("open");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<BroadcastStatus | "">("");
  const [search, setSearch] = useState("");
  const q = useDebouncedValue(search);
  const { data, isLoading } = useBroadcastsQuery({ page, limit: LIMIT, status, q });

  const open = (id: string | null) =>
    router.replace(id ? `${pathname}?open=${id}` : pathname, { scroll: false });

  return (
    <PageLayout
      title="Broadcasts"
      subtitle="Every announcement and campaign, who it reached and how delivery went. Progress updates live while sending."
      actionButton={
        <Button nativeButton={false} render={<Link href="/admin/communications/new" />}>
          New broadcast
        </Button>
      }
      controls={
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Search by title"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="sm:max-w-xs"
            aria-label="Search broadcasts"
          />
          <FilterSelect
            value={status}
            onChange={(v) => {
              setStatus(v as BroadcastStatus | "");
              setPage(1);
            }}
            options={BROADCAST_STATUSES}
            allLabel="All statuses"
            label="Status"
          />
        </div>
      }
      pagination={
        data && <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />
      }
    >
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Broadcast</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <EmptyRow colSpan={5}>Loading…</EmptyRow>
            ) : !data?.items.length ? (
              <EmptyRow colSpan={5}>
                {q || status ? "No broadcasts match." : "No broadcasts yet."}
              </EmptyRow>
            ) : (
              data.items.map((b) => (
                <TableRow
                  key={b.id}
                  tabIndex={0}
                  className={clickableRow}
                  onClick={() => open(b.id)}
                  onKeyDown={(e) => e.key === "Enter" && open(b.id)}
                >
                  <TableCell>
                    <div className="font-medium">{b.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                      <CategoryBadge category={b.category} />
                      {dateTime(
                        b.scheduled_for && b.status === "queued" ? b.scheduled_for : b.created_at,
                      )}
                      {b.created_by && ` · ${b.created_by}`}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {audienceLabel(b.audience)}
                    <div className="text-xs text-muted-foreground">
                      {b.recipients_count.toLocaleString()} people
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {b.channels.map((c) => CHANNEL_LABELS[c]).join(", ")}
                  </TableCell>
                  <TableCell>
                    <DeliverySummary counts={b.stats.channels} />
                  </TableCell>
                  <TableCell>
                    <BroadcastStatusBadge status={b.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <BroadcastDetailSheet id={openId} onClose={() => open(null)} />
    </PageLayout>
  );
};
