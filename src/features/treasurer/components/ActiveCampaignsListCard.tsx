"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/features/shared/components/EmptyState";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { useWorkspaceOverviewQuery } from "@/features/treasurer/services/queries";
import { getAvatarColor } from "@/lib/colors";
import { cn, getInitials } from "@/lib/utils";

const ActiveCampaignsListCard = () => {
  const { data: overview, isLoading } = useWorkspaceOverviewQuery();

  if (isLoading) {
    return (
      <Card className="flex-1 flex flex-col">
        <div className="flex flex-col gap-4 p-4">
          {["sk-1", "sk-2", "sk-3"].map((key) => (
            <div key={key} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-32" />
              <div className="flex items-center gap-4 py-2">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const campaigns = overview?.recent_campaigns ?? [];

  // Group campaigns by group_name
  const groupedCampaigns = campaigns.reduce(
    (acc, campaign) => {
      if (!acc[campaign.group_name]) {
        acc[campaign.group_name] = [];
      }
      acc[campaign.group_name].push(campaign);
      return acc;
    },
    {} as Record<string, typeof campaigns>,
  );

  return (
    <Card className="flex-1 flex flex-col">
      <ScrollArea className="h-87.5 pr-4">
        <div className="flex flex-col p-4 pt-2 gap-6">
          {Object.entries(groupedCampaigns).map(([groupName, groupCampaigns]) => (
            <div key={groupName} className="flex flex-col gap-2">
              <Link
                href={
                  groupCampaigns[0]?.group_slug
                    ? `/treasurer/groups/${groupCampaigns[0].group_slug}/overview`
                    : `/treasurer/groups/${groupCampaigns[0]?.group_id}/overview`
                }
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground pl-2 flex items-center gap-1.5 hover:text-foreground transition-colors group/group-link"
              >
                <IconLibrary
                  name="group"
                  className="w-3 h-3 group-hover/group-link:text-primary transition-colors"
                />
                {groupName}
              </Link>
              <div className="flex flex-col">
                {groupCampaigns.map((campaign) => {
                  const progressPercentage =
                    campaign.target_amount > 0
                      ? Math.min(100, (campaign.amount_raised / campaign.target_amount) * 100)
                      : 0;
                  const isCompleted = progressPercentage >= 100 || campaign.status === "completed";
                  const detailHref =
                    campaign.group_slug && campaign.campaign_slug
                      ? `/treasurer/groups/${campaign.group_slug}/campaigns/${campaign.campaign_slug}/contributions`
                      : `/treasurer/groups/${campaign.group_id}/campaigns/${campaign.campaign_id}/contributions`;

                  return (
                    <Link
                      key={campaign.campaign_id}
                      href={detailHref}
                      className="flex items-center gap-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors rounded-lg px-2 group"
                    >
                      <div
                        className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold shrink-0 text-sm text-white",
                          getAvatarColor(campaign.title),
                        )}
                      >
                        {getInitials(campaign.title)}
                      </div>
                      <div className="flex flex-col flex-1 gap-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-foreground font-semibold text-sm sm:text-base line-clamp-1 flex items-center gap-2">
                            {campaign.title}
                            {isCompleted && (
                              <IconLibrary
                                name="badge-check"
                                className="w-4 h-4 text-primary shrink-0"
                              />
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 w-full max-w-[200px]">
                          <Progress
                            value={progressPercentage}
                            className="w-full **:data-[slot=progress-track]:h-1.5 **:data-[slot=progress-track]:bg-primary/20 **:data-[slot=progress-indicator]:bg-primary"
                          />
                          <span className="text-xs font-bold text-primary tabular-nums leading-none min-w-[3ch] text-right">
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          {campaigns.length === 0 && (
            <div className="py-8">
              <EmptyState message="No active campaigns yet." />
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ActiveCampaignsListCard;
