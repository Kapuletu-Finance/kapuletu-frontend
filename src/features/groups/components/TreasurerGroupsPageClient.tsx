"use client";

import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CreateGroupButtonDialogForm from "@/features/groups/components/CreateGroupButtonDialogForm";
import GroupCard, { type GroupInfo } from "@/features/groups/components/GroupCard";
import GroupsHeaderControls, {
  type FilterValue,
} from "@/features/groups/components/GroupsHeaderControls";
import { useToggleGroupFavoriteMutation } from "@/features/groups/services/mutations";
import { useGroupsQuery } from "@/features/groups/services/queries";
import EmptyState from "@/features/shared/components/EmptyState";
import IconLibrary from "@/features/shared/components/IconLibrary";
import PageLayout from "@/features/shared/components/PageLayout";
import StatCard from "@/features/shared/components/StatCard";
import type { GroupOut } from "@/features/shared/types";
import { getAvatarColor } from "@/lib/colors";
import { cn } from "@/lib/utils";

const mapGroupToInfo = (group: GroupOut): GroupInfo => ({
  id: group.id,
  slug: group.slug || undefined,
  name: group.name,
  description: group.description || "",
  iconClassName: getAvatarColor(group.name),
  status: group.status === "active" ? "Active" : "Archived",
  isFavorite: group.is_favorite,
  campaigns: [],
  total_campaigns_count: group.total_campaigns_count,
  active_campaigns_count: group.active_campaigns_count,
  total_funds_raised: group.total_funds_raised,
});

export const TreasurerGroupsPageClient = () => {
  const [view] = useQueryState("view", parseAsString.withDefault("grid"));
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [filter, setFilter] = useQueryState("filter", parseAsString.withDefault("all"));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));
  const limit = 12;

  const { data, isLoading } = useGroupsQuery({
    skip: page * limit,
    limit,
    search: search || undefined,
    group_status: filter === "all" ? undefined : (filter as FilterValue),
  });

  const groups = (data?.items ?? []).map(mapGroupToInfo);
  const totalPages = data?.total_pages ?? 1;
  const totalItems = data?.total_items ?? 0;

  const activeGroups = groups.filter((g) => g.status === "Active").length;
  const archivedGroups = groups.filter((g) => g.status === "Archived").length;

  const handleSearchChange = React.useCallback(
    (value: string) => {
      setSearch(value);
      setPage(0);
    },
    [setSearch, setPage],
  );

  const handleFilterChange = React.useCallback(
    (value: FilterValue) => {
      setFilter(value);
      setPage(0);
    },
    [setFilter, setPage],
  );

  const toggleFavorite = useToggleGroupFavoriteMutation();

  return (
    <PageLayout
      actionButton={<CreateGroupButtonDialogForm />}
      stats={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <StatCard label="Total number of groups" count={totalItems} iconName="group" />
          <StatCard label="Active groups" count={activeGroups} iconName="check-circle" />
          <StatCard label="Archived groups" count={archivedGroups} iconName="lock" />
        </div>
      }
      controls={
        <GroupsHeaderControls
          searchValue={search}
          filterValue={filter as FilterValue}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />
      }
      pagination={
        totalPages > 1 ? (
          <div className="flex justify-center items-center gap-2 pt-6">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full text-muted-foreground"
              disabled={page === 0}
              onClick={() => setPage(Math.max(0, page - 1))}
            >
              <IconLibrary name="chevron-left" className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
              <Button
                key={String(i + 1)}
                variant={page === i ? "default" : "outline"}
                size="icon"
                className={cn(
                  "rounded-full font-semibold shadow-sm",
                  page !== i && "text-foreground font-medium",
                )}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="rounded-full text-muted-foreground"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            >
              <IconLibrary name="chevron-right" className="w-4 h-4" />
            </Button>
          </div>
        ) : undefined
      }
    >
      {isLoading ? (
        <div
          className={cn(
            view === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "flex flex-col gap-4",
          )}
        >
          {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"].map((key) => (
            <Card key={key} className="rounded-3xl border-none shadow-sm p-6 space-y-6 bg-card">
              <CardHeader className="p-0 flex-row items-center gap-4 space-y-0">
                <Skeleton className="w-16 h-16 rounded-full shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <Skeleton className="h-6 w-36 rounded-md" />
                  <Skeleton className="h-4 w-48 rounded-md" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </CardHeader>
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 w-28 rounded-md" />
                <Skeleton className="h-9 w-32 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md shrink-0" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div
          className={cn(
            view === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "flex flex-col gap-4",
          )}
        >
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              variant={view as "grid" | "list"}
              onToggleFavorite={() => toggleFavorite.mutate(group.id)}
            />
          ))}
          {groups.length === 0 && (
            <div className="col-span-full py-12">
              <EmptyState message="No groups found." />
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
};

export default TreasurerGroupsPageClient;
