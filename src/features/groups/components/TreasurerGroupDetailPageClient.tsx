"use client";

import { useParams } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import * as React from "react";
import { Button } from "@/components/ui/button";
import CampaignCard, { type CampaignInfo } from "@/features/campaigns/components/CampaignCard";
import { CampaignFormModal } from "@/features/campaigns/components/CampaignFormModal";
import CampaignsHeaderControls from "@/features/campaigns/components/CampaignsHeaderControls";
import IconLibrary from "@/features/shared/components/IconLibrary";
import PageLayout from "@/features/shared/components/PageLayout";
import StatCard from "@/features/shared/components/StatCard";
import { cn } from "@/lib/utils";

interface TreasurerGroupDetailPageClientProps {
  campaigns: CampaignInfo[];
}

export const TreasurerGroupDetailPageClient: React.FC<TreasurerGroupDetailPageClientProps> = ({
  campaigns,
}) => {
  const [view] = useQueryState("view", parseAsString.withDefault("grid"));
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingCampaign, setEditingCampaign] = React.useState<CampaignInfo | null>(null);
  const params = useParams();
  const groupSlug = typeof params.slug === "string" ? params.slug : undefined;

  const activeCampaigns = campaigns.filter((c) => c.status === "Active").length;
  const archivedCampaigns = campaigns.filter((c) => c.status === "Archived").length;

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
              count={campaigns.length}
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
        controls={<CampaignsHeaderControls />}
        pagination={
          <div className="flex justify-center items-center gap-2 pt-6">
            <Button variant="outline" size="icon" className="rounded-full text-muted-foreground">
              <IconLibrary name="chevron-left" className="w-4 h-4" />
            </Button>
            <Button size="icon" className="rounded-full font-semibold shadow-sm">
              1
            </Button>
            <Button variant="outline" size="icon" className="rounded-full text-muted-foreground">
              <IconLibrary name="chevron-right" className="w-4 h-4" />
            </Button>
          </div>
        }
      >
        <div
          className={cn(
            view === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "flex flex-col gap-4",
          )}
        >
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id ?? campaign.name}
              campaign={campaign}
              groupSlug={groupSlug}
              variant={view as "grid" | "list"}
              onManageCampaign={() => setEditingCampaign(campaign)}
            />
          ))}
        </div>
      </PageLayout>
      <CampaignFormModal isOpen={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
      <CampaignFormModal
        campaign={editingCampaign}
        isOpen={!!editingCampaign}
        onOpenChange={(open) => {
          if (!open) setEditingCampaign(null);
        }}
      />
    </>
  );
};
