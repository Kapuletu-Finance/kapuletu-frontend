"use client";

import { useParams } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CampaignCard, { type CampaignInfo } from "@/features/campaigns/components/CampaignCard";
import { CampaignFormModal } from "@/features/campaigns/components/CampaignFormModal";
import CampaignsHeaderControls, {
  type FilterValue,
} from "@/features/campaigns/components/CampaignsHeaderControls";
import { useCampaignsQuery } from "@/features/campaigns/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import PageLayout from "@/features/shared/components/PageLayout";
import StatCard from "@/features/shared/components/StatCard";
import type { CampaignOut } from "@/features/shared/types";
import { getAvatarColor } from "@/lib/colors";
import { cn } from "@/lib/utils";

const mapCampaignToInfo = (campaign: CampaignOut): CampaignInfo => ({
  id: campaign.id,
  group_id: campaign.group_id,
  name: campaign.title,
  description: campaign.description || "",
  iconClassName: getAvatarColor(campaign.title),
  status: campaign.status === "active" ? "Active" : "Archived",
  isFavorite: false,
  progress: campaign.progress_percentage ?? 0,
  target_amount: campaign.target_amount,
  total_raised: campaign.total_raised,
  contributor_count: campaign.contributor_count,
});

export const TreasurerGroupDetailPageClient = () => {
  const [view] = useQueryState("view", parseAsString.withDefault("grid"));
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingCampaign, setEditingCampaign] = React.useState<CampaignInfo | null>(null);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<FilterValue>("all");
  const [page, setPage] = React.useState(0);

  const params = useParams();
  const groupId = typeof params.groupId === "string" ? params.groupId : "";
  const limit = 12;

  const { data, isLoading } = useCampaignsQuery(groupId, {
    skip: page * limit,
    limit,
    search: search || undefined,
    campaign_status: filter === "all" ? undefined : filter,
  });

  const campaigns = (data?.items ?? []).map(mapCampaignToInfo);
  const totalPages = data?.total_pages ?? 1;
  const totalItems = data?.total_items ?? 0;

  const activeCampaigns = campaigns.filter((c) => c.status === "Active").length;
  const archivedCampaigns = campaigns.filter((c) => c.status === "Archived").length;

  const handleSearchChange = React.useCallback((value: string) => {
    setSearch(value);
    setPage(0);
  }, []);

  const handleFilterChange = React.useCallback((value: FilterValue) => {
    setFilter(value);
    setPage(0);
  }, []);

  return (
    <>
      <PageLayout
        actionButton={
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 gap-2"
            onClick={() => setIsCreateModalOpen(true)}
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
              trend="- 0% vs last month"
              trendDirection="neutral"
              iconName="group"
            />
            <StatCard
              label="Active campaigns"
              count={activeCampaigns}
              trend="- 0% vs last month"
              trendDirection="neutral"
              iconName="check-circle"
            />
            <StatCard
              label="Archived campaigns"
              count={archivedCampaigns}
              trend="- 0% vs last month"
              trendDirection="neutral"
              iconName="lock"
            />
          </div>
        }
        controls={
          <CampaignsHeaderControls
            searchValue={search}
            filterValue={filter}
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
                onClick={() => setPage((p) => Math.max(0, p - 1))}
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
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
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
              <Skeleton key={key} className="h-64 rounded-3xl" />
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
                groupId={groupId}
                variant={view as "grid" | "list"}
                onManageCampaign={() => setEditingCampaign(campaign)}
              />
            ))}
            {campaigns.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No campaigns found.
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
