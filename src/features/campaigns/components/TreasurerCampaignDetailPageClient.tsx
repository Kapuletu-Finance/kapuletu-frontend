"use client";

import { useQueryState } from "nuqs";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CampaignInfo } from "@/features/campaigns/components/CampaignCard";
import PageLayout from "@/features/shared/components/PageLayout";
import { cn, getInitials } from "@/lib/utils";

interface TreasurerCampaignDetailPageClientProps {
  campaign: CampaignInfo;
}

export const TreasurerCampaignDetailPageClient: React.FC<
  TreasurerCampaignDetailPageClientProps
> = ({ campaign }) => {
  const isArchived = campaign.status === "Archived";
  const [tab, setTab] = useQueryState("tab", { defaultValue: "overview" });

  return (
    <PageLayout>
      <div className="flex flex-col gap-8">
        {/* Campaign Header Profile */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <div
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shrink-0",
                campaign.iconClassName ?? "bg-[#1E3A8A] text-white",
              )}
            >
              {getInitials(campaign.name)}
            </div>

            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{campaign.name}</h1>

              <div className="flex items-center gap-4 text-sm">
                {campaign.status && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "font-medium px-3 py-1 text-xs gap-1.5 border-none shadow-none",
                      isArchived
                        ? "bg-muted text-muted-foreground"
                        : "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        isArchived ? "bg-muted-foreground" : "bg-emerald-600 dark:bg-emerald-400",
                      )}
                    />
                    {campaign.status}
                  </Badge>
                )}

                <span className="text-muted-foreground font-medium">15 days left.</span>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground">{campaign.description}</p>
        </div>

        {/* Tabs and Content */}
        <Tabs value={tab} onValueChange={(val) => setTab(val as string)} className="w-full">
          <div className="border-b mb-6">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-8 border-none">
              <TabsTrigger
                value="overview"
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-2 py-3 font-semibold"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="contributions"
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-2 py-3 font-semibold text-muted-foreground data-[state=active]:text-foreground"
              >
                Contributions
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-2 py-3 font-semibold text-muted-foreground data-[state=active]:text-foreground"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-2 py-3 font-semibold text-muted-foreground data-[state=active]:text-foreground"
              >
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Empty Card 1 */}
              <Card className="min-h-100 bg-muted/30 border-muted" />

              {/* Campaign Summary Card */}
              <Card className="min-h-100 bg-muted/30 border-muted p-6">
                <h3 className="font-semibold text-foreground">Campaign Summary</h3>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contributions" className="mt-0">
            {/* Placeholder for Contributions */}
            <Card className="min-h-100 bg-muted/30 border-muted p-6 flex items-center justify-center text-muted-foreground">
              Contributions Content
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            {/* Placeholder for Activity */}
            <Card className="min-h-100 bg-muted/30 border-muted p-6 flex items-center justify-center text-muted-foreground">
              Activity Content
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            {/* Placeholder for Settings */}
            <Card className="min-h-100 bg-muted/30 border-muted p-6 flex items-center justify-center text-muted-foreground">
              Settings Content
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};
