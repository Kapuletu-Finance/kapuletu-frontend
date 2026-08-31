"use client";

import { useParams } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMySubscriptionQuery } from "@/features/auth/services/queries";
import CampaignCard, { type CampaignInfo } from "@/features/campaigns/components/CampaignCard";
import { CampaignFormModal } from "@/features/campaigns/components/CampaignFormModal";
import CampaignsHeaderControls, {
  type FilterValue,
} from "@/features/campaigns/components/CampaignsHeaderControls";
import { useCampaignsQuery } from "@/features/campaigns/services/queries";
import { useGroupsQuery } from "@/features/groups/services/queries";
import EmptyState from "@/features/shared/components/EmptyState";
import IconLibrary from "@/features/shared/components/IconLibrary";
import PageLayout from "@/features/shared/components/PageLayout";
import StatCard from "@/features/shared/components/StatCard";
import { usePlanLimits } from "@/features/shared/hooks/usePlanLimits";
import { useUpgradeModal } from "@/features/shared/providers/UpgradeModalProvider";
import type { CampaignOut } from "@/features/shared/types";
import { getAvatarColor } from "@/lib/colors";
import { cn } from "@/lib/utils";

const mapCampaignToInfo = (campaign: CampaignOut): CampaignInfo => ({
  id: campaign.id,
  group_id: campaign.group_id,
  slug: campaign.slug || undefined,
  name: campaign.title,
  description: campaign.description || "",
  iconClassName: getAvatarColor(campaign.title),
  status: campaign.status === "active" ? "Active" : "Archived",
  isFavorite: campaign.is_favorite,
  progress: campaign.progress_percentage ?? 0,
  target_amount: campaign.target_amount,
  total_raised: campaign.total_raised,
  contributor_count: campaign.contributor_count,
  end_date: campaign.end_date,
});

export const TreasurerGroupDetailPageClient = () => {
  const [view] = useQueryState("view", parseAsString.withDefault("grid"));
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingCampaign, setEditingCampaign] = React.useState<CampaignInfo | null>(null);
  const { data: subscription } = useGetMySubscriptionQuery();
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [filter, setFilter] = useQueryState("filter", parseAsString.withDefault("all"));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const params = useParams();
  const groupSlug = typeof params.groupSlug === "string" ? params.groupSlug : "";
  const limit = 12;

  // Resolve group UUID from slug
  const { data: groupsData, isLoading: isGroupsLoading } = useGroupsQuery({ limit: 100 });
  const currentGroup = groupsData?.items?.find((g) => g.slug === groupSlug);
  const groupId = currentGroup?.id || "";

  const { data, isLoading: isCampaignsLoading } = useCampaignsQuery(groupId, {
    skip: (page - 1) * limit,
    limit,
    search: search || undefined,
    campaign_status: filter === "all" ? undefined : (filter as FilterValue),
  });

  const isLoading = isGroupsLoading || isCampaignsLoading;

  const campaigns = (data?.items ?? []).map(mapCampaignToInfo);
  const totalPages = data?.total_pages ?? 1;
  const totalItems = data?.total_items ?? 0;

  const activeCampaigns = campaigns.filter((c) => c.status === "Active").length;
  const archivedCampaigns = campaigns.filter((c) => c.status === "Archived").length;

  const handleSearchChange = React.useCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);
    },
    [setSearch, setPage],
  );

  const handleFilterChange = React.useCallback(
    (value: FilterValue) => {
      setFilter(value);
      setPage(1);
    },
    [setFilter, setPage],
  );

  const { canCreateCampaign, isPending: limitsPending } = usePlanLimits();
  const { openModal } = useUpgradeModal();

  const handleCreateClick = (e: React.MouseEvent) => {
    if (!limitsPending && !canCreateCampaign) {
      e.preventDefault();
      openModal("You've reached the maximum number of campaigns allowed on your current plan.");
    } else {
      setIsCreateModalOpen(true);
    }
  };

  return (
    <>
      <PageLayout
        actionButton={
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 gap-2"
            onClick={handleCreateClick}
          >
            <IconLibrary name="add" className="w-4 h-4" />
            New Campaign
          </Button>
        }
        stats={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <StatCard
              label="Total campaigns"
              count={totalItems}
              iconName="group"
              isLoading={isLoading}
            />
            <StatCard
              label="Active campaigns"
              count={activeCampaigns}
              iconName="check-circle"
              isLoading={isLoading}
            />
            <StatCard
              label="Archived campaigns"
              count={archivedCampaigns}
              iconName="lock"
              isLoading={isLoading}
            />
          </div>
        }
        controls={
          <CampaignsHeaderControls
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
                className="text-muted-foreground"
                disabled={page === 1}
                onClick={() => setPage(Math.max(1, page - 1))}
              >
                <IconLibrary name="chevron-left" className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                <Button
                  key={String(i + 1)}
                  variant={page === i + 1 ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "font-semibold shadow-sm",
                    page !== i + 1 && "text-foreground font-medium",
                  )}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="text-muted-foreground"
                disabled={page >= totalPages}
                onClick={() => setPage(Math.min(totalPages, page + 1))}
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
              <Card key={key} className="border border-border flex flex-col justify-between h-full">
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 shrink-0" />
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-5 w-36" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16" />
                </CardHeader>
                <CardFooter className="flex flex-row items-center gap-2 border-none bg-transparent">
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-36" />
                  <Skeleton className="h-10 w-10 shrink-0" />
                </CardFooter>
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
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                groupId={groupSlug}
                variant={view as "grid" | "list"}
                onEditCampaign={() => setEditingCampaign(campaign)}
              />
            ))}
            {campaigns.length === 0 && (
              <div className="col-span-full py-12">
                <EmptyState message="No campaigns found." />
              </div>
            )}
          </div>
        )}
      </PageLayout>
      <CampaignFormModal
        groupId={groupId}
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <CampaignFormModal
        groupId={groupId}
        campaign={editingCampaign}
        isOpen={!!editingCampaign}
        onOpenChange={(open) => {
          if (!open) setEditingCampaign(null);
        }}
      />
    </>
  );
};

export default TreasurerGroupDetailPageClient;
