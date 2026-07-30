"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import type { CampaignInfo } from "@/features/campaigns/components/CampaignCard";
import IconLibrary, { type IconName } from "@/features/shared/components/IconLibrary";
import PageLayout from "@/features/shared/components/PageLayout";
import { cn, getInitials } from "@/lib/utils";

interface TreasurerCampaignDetailPageClientProps {
  campaign: CampaignInfo;
  children?: React.ReactNode;
}

export const TreasurerCampaignDetailPageClient: React.FC<
  TreasurerCampaignDetailPageClientProps
> = ({ campaign, children }) => {
  const isArchived = campaign.status === "Archived";
  const pathname = usePathname();
  const params = useParams();
  const groupSlug = typeof params.groupSlug === "string" ? params.groupSlug : "";

  const baseUrl = `/treasurer/groups/${groupSlug}/campaigns/${campaign.slug}`;

  const tabs: { value: string; label: string; icon: IconName; href: string }[] = [
    { value: "overview", label: "Overview", icon: "panel-left", href: baseUrl },
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
            <div
              className={cn(
                "w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl font-bold shrink-0",
                campaign.iconClassName ?? "bg-primary text-primary-foreground",
              )}
            >
              {getInitials(campaign.name)}
            </div>

            <div className="flex flex-col justify-center gap-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {campaign.name}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">{campaign.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-center ml-21 sm:ml-0">
            <span className="text-sm text-muted-foreground font-medium">15 days left</span>
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
