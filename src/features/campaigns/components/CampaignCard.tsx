import Link from "next/link";
import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn, getInitials } from "@/lib/utils";

export interface CampaignInfo {
  id?: string;
  slug: string;
  name: string;
  description: string;
  iconClassName?: string;
  status?: string;
  isFavorite?: boolean;
  progress: number;
}

export interface CampaignCardProps {
  campaign: CampaignInfo;
  groupSlug?: string;
  className?: string;
  variant?: "grid" | "list";
  onViewDetails?: () => void;
  onManageCampaign?: () => void;
  onToggleFavorite?: () => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  groupSlug,
  className,
  variant = "grid",
  onViewDetails,
  onManageCampaign,
  onToggleFavorite,
}) => {
  const isArchived = campaign.status === "Archived";

  const ProgressBar = ({ className }: { className?: string }) => (
    <div className={cn("flex items-center gap-3 w-32 sm:w-40 shrink-0", className)}>
      <Progress
        value={campaign.progress}
        className="w-full **:data-[slot=progress-track]:h-1.5 **:data-[slot=progress-track]:bg-emerald-500/20 **:data-[slot=progress-indicator]:bg-emerald-600"
      />
      <span className="text-xs font-bold text-emerald-600 tabular-nums leading-none min-w-[3ch] text-right">
        {campaign.progress}%
      </span>
    </div>
  );

  if (variant === "list") {
    return (
      <Card
        className={cn(
          "border-none shadow-sm p-4 bg-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4",
          className,
        )}
      >
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
              campaign.iconClassName ?? "bg-primary/15 text-primary",
            )}
          >
            {getInitials(campaign.name)}
          </div>
          <div className="flex flex-col min-w-50">
            <h3 className="text-base font-bold tracking-tight text-foreground leading-tight truncate">
              {campaign.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">{campaign.description}</p>
          </div>
          {campaign.status && (
            <Badge
              variant="secondary"
              className={cn(
                "ml-4 font-semibold rounded-full px-2.5 py-0.5 text-[10px] gap-1.5 border-none shadow-none hidden sm:inline-flex shrink-0",
                isArchived
                  ? "bg-muted text-muted-foreground"
                  : "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
              )}
            >
              <span
                className={cn(
                  "w-1 h-1 rounded-full shrink-0",
                  isArchived ? "bg-muted-foreground" : "bg-emerald-600 dark:bg-emerald-400",
                )}
              />
              {campaign.status}
            </Badge>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto justify-end">
          <ProgressBar className="hidden sm:flex" />

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={
                groupSlug
                  ? `/treasurer/groups/${groupSlug}/campaigns/${campaign.slug}`
                  : `/treasurer/campaigns/${campaign.slug}`
              }
            >
              <Button
                size="sm"
                onClick={onViewDetails}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 h-9"
              >
                View Details
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={onManageCampaign}
              className="border-primary text-primary hover:text-primary hover:bg-primary/5 h-9"
            >
              Manage Campaign
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onToggleFavorite}
              className="rounded-full border border-border h-9 w-9 shrink-0 flex items-center justify-center"
            >
              <IconLibrary
                name="favorite"
                className={cn(
                  "w-4 h-4",
                  campaign.isFavorite
                    ? "text-destructive fill-destructive"
                    : "text-muted-foreground",
                )}
              />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "border border-border shadow-sm flex flex-col justify-between h-full",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 p-5">
        <div className="flex items-center gap-4 overflow-hidden">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
              campaign.iconClassName ?? "bg-primary/15 text-primary",
            )}
          >
            {getInitials(campaign.name)}
          </div>
          <div className="flex flex-col justify-center overflow-hidden gap-1">
            <CardTitle className="text-lg font-semibold tracking-tight text-foreground truncate">
              {campaign.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground truncate">
              {campaign.description}
            </CardDescription>
          </div>
        </div>

        {campaign.status && (
          <div className="shrink-0 self-start mt-1">
            <Badge
              variant="secondary"
              className={cn(
                "font-medium rounded-full px-3 py-1 text-xs gap-1.5 border-none shadow-none",
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
          </div>
        )}
      </CardHeader>

      <CardFooter className="flex flex-row items-center gap-2 border-none bg-transparent p-5 pt-0">
        <Link
          href={
            groupSlug
              ? `/treasurer/groups/${groupSlug}/campaigns/${campaign.slug}`
              : `/treasurer/campaigns/${campaign.slug}`
          }
        >
          <Button
            onClick={onViewDetails}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 h-10 rounded-lg text-sm font-medium"
          >
            View Details
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={onManageCampaign}
          className="border-primary text-primary hover:text-primary hover:bg-primary/5 h-10 px-5 rounded-lg text-sm font-medium"
        >
          Manage Campaign
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleFavorite}
          className="rounded-full border border-border h-10 w-10 shrink-0 flex items-center justify-center bg-transparent"
        >
          <IconLibrary
            name="favorite"
            className={cn(
              "w-5 h-5",
              campaign.isFavorite ? "text-destructive fill-destructive" : "text-muted-foreground",
            )}
          />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;
