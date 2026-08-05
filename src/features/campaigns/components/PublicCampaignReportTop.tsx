"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PublicCampaignContributions from "@/features/campaigns/components/PublicCampaignContributions";
import PublicCampaignProgressCard from "@/features/campaigns/components/PublicCampaignProgressCard";
import PublicCampaignSummaryCard from "@/features/campaigns/components/PublicCampaignSummaryCard";
import { usePublicCampaignReportQuery } from "@/features/campaigns/services/queries";
import { getAvatarColor } from "@/lib/colors";
import { cn, getInitials } from "@/lib/utils";

const PublicCampaignReportTop = () => {
  const params = useParams();
  const router = useRouter();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const groupId = typeof params.groupId === "string" ? params.groupId : "";

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pin, setPin] = useState<string | undefined>();

  useEffect(() => {
    if (!campaignSlug) return;
    const storedPin = sessionStorage.getItem(`campaign_pin_${campaignSlug}`);
    if (storedPin === null) {
      router.replace(`/report/w/${workspaceId}/g/${groupId}/c/${campaignSlug}/auth`);
    } else {
      setPin(storedPin);
      setIsAuthorized(true);
    }
  }, [campaignSlug, workspaceId, groupId, router]);

  const {
    data: report,
    isLoading,
    isError,
    error,
  } = usePublicCampaignReportQuery(
    workspaceId,
    groupId,
    campaignSlug,
    { pin: pin || "" },
    isAuthorized,
  );

  useEffect(() => {
    // If the query returns a 403, the PIN is invalid (maybe expired or changed)
    if (isError && (error as { response?: { status?: number } })?.response?.status === 403) {
      sessionStorage.removeItem(`campaign_pin_${campaignSlug}`);
      router.replace(`/report/w/${workspaceId}/g/${groupId}/c/${campaignSlug}/auth`);
    }
  }, [isError, error, campaignSlug, workspaceId, groupId, router]);

  if (!isAuthorized) {
    return null; // or a loading spinner
  }

  const title = report?.campaign_title || "";
  const description = report?.campaign_description || "";

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
        </CardContent>
      </Card>

      {/* Campaign Detail Components */}
      {report && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
            <div className="xl:col-span-2">
              <PublicCampaignProgressCard report={report} />
            </div>
            <div className="xl:col-span-1">
              <PublicCampaignSummaryCard report={report} />
            </div>
          </div>

          <div className="mt-8">
            <PublicCampaignContributions contributors={report.contributors} />
          </div>
        </>
      )}
    </div>
  );
};

export default PublicCampaignReportTop;
