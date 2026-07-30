"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { CampaignInfo } from "@/features/campaigns/components/CampaignCard";
import IconLibrary, { type IconName } from "@/features/shared/components/IconLibrary";
import PageLayout from "@/features/shared/components/PageLayout";
import { cn, getInitials } from "@/lib/utils";

interface TreasurerCampaignDetailPageClientProps {
  campaign: CampaignInfo;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const TreasurerCampaignDetailPageClient: React.FC<
  TreasurerCampaignDetailPageClientProps
> = ({ campaign, isLoading, children }) => {
  const isArchived = campaign.status === "Archived";
  const pathname = usePathname();
  const params = useParams();
  const groupSlug = typeof params.groupSlug === "string" ? params.groupSlug : "";

  const baseUrl = `/treasurer/groups/${groupSlug}/campaigns/${campaign.slug || ""}`;

  const tabs: { value: string; label: string; icon: IconName; href: string }[] = [
    { value: "overview", label: "Overview", icon: "panels-top-left", href: baseUrl },
    {
      value: "contributions",
      label: "Contributions",
      icon: "transaction",
      href: `${baseUrl}/contributions`,
    },
    { value: "reports", label: "Reports", icon: "report", href: `${baseUrl}/reports` },
    { value: "settings", label: "Settings", icon: "settings", href: `${baseUrl}/settings` },
  ];

  const getIsActive = (value: string) => {
    if (value === "overview") {
      return pathname === baseUrl || pathname === `${baseUrl}/`;
    }
    return pathname.startsWith(`${baseUrl}/${value}`);
  };

  return (
    <PageLayout>
      <div className="flex flex-col gap-8">
        {/* Campaign Header Profile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
          <div className="flex items-center gap-5">
            {isLoading ? (
              <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 shrink-0" />
            ) : (
              <div
                className={cn(
                  "w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl font-bold shrink-0",
                  campaign.iconClassName ?? "bg-primary text-primary-foreground",
                )}
              >
                {getInitials(campaign.name)}
              </div>
            )}

            <div className="flex flex-col justify-center gap-1.5">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 sm:h-9 w-48 sm:w-64" />
                  <Skeleton className="h-5 sm:h-6 w-32 sm:w-48 mt-1" />
                </>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {campaign.name}
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {campaign.description}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-center ml-21 sm:ml-0">
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <>
                {campaign.end_date &&
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
                {campaign.status && (
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
                    {campaign.status}
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="w-full">
          <div className="border-b mb-6">
            <nav className="w-full flex flex-wrap justify-between sm:justify-start h-auto p-0 bg-transparent gap-4 sm:gap-12 border-none">
              {tabs.map((tab) => {
                const isActive = getIsActive(tab.value);
                return (
                  <Link
                    key={tab.value}
                    href={tab.href}
                    className={cn(
                      "flex items-center gap-2 border-b-2 px-1 py-3 font-medium transition-colors",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <IconLibrary name={tab.icon} className="w-4 h-4" />
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-0 outline-none">{children}</div>
        </div>
      </div>
    </PageLayout>
  );
};
