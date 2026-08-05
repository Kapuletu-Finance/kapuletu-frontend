"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CampaignContributions from "@/features/campaigns/components/CampaignContributions";
import CampaignProgressCard from "@/features/campaigns/components/CampaignProgressCard";
import CampaignSummaryCard from "@/features/campaigns/components/CampaignSummaryCard";
import { useCampaignQuery } from "@/features/campaigns/services/queries";
import { getAvatarColor } from "@/lib/colors";
import { cn, getInitials } from "@/lib/utils";

const PublicCampaignReportTop = () => {
  const params = useParams();
  const router = useRouter();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!campaignSlug) return;
    const authFlag = sessionStorage.getItem(`campaign_auth_${campaignSlug}`);
    if (authFlag !== "true") {
      router.replace(`/campaign-report/${campaignSlug}/auth`);
    } else {
      setIsAuthorized(true);
    }
  }, [campaignSlug, router]);

  const { data: campaign, isLoading } = useCampaignQuery(campaignSlug);

  if (!isAuthorized) {
    return null; // or a loading spinner
  }

  const title = campaign?.title || "";
  const description = campaign?.description || "";
  const isArchived = campaign?.status !== "active";

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Header Card */}
      <Card className="bg-secondary/30 border-border/50 shadow-sm rounded-3xl">
        <CardContent className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {isLoading ? (
              <Skeleton className="w-16 h-16 rounded-full shrink-0" />
            ) : (
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0",
                  getAvatarColor(title),
                )}
              >
                {getInitials(title)}
              </div>
            )}
            <div className="flex flex-col justify-center gap-1.5">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-5 w-64 mt-1" />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                  <p className="text-muted-foreground text-sm">{description}</p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <>
                {campaign?.end_date &&
                  (() => {
                    const daysLeft = Math.ceil(
                      (new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                    );
                    if (daysLeft <= 0)
                      return (
                        <span className="text-sm text-muted-foreground font-medium">
                          Deadline passed
                        </span>
                      );
                    return (
                      <span className="text-sm text-muted-foreground font-medium">
                        {daysLeft} days left
                      </span>
                    );
                  })()}
                {campaign?.status && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "font-medium px-3 py-1 text-xs gap-1.5 border-none shadow-none",
                      isArchived
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/15 text-primary dark:bg-primary/20 dark:text-primary",
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        isArchived ? "bg-muted-foreground" : "bg-primary dark:bg-primary",
                      )}
                    />
                    {isArchived ? "Archived" : "Active"}
                  </Badge>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Detail Components */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
        <div className="xl:col-span-2">
          <CampaignProgressCard />
        </div>
        <div className="xl:col-span-1">
          <CampaignSummaryCard />
        </div>
      </div>

      <div className="mt-8">
        <CampaignContributions />
      </div>
    </div>
  );
};

export default PublicCampaignReportTop;
