import Link from "next/link";
import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn, getInitials } from "@/lib/utils";

export interface CampaignProgress {
  name: string;
  progress: number;
}

export interface GroupInfo {
  id: string;
  slug?: string;
  name: string;
  description: string;
  iconClassName?: string;
  status?: string;
  isFavorite?: boolean;
  campaigns?: CampaignProgress[];
  total_campaigns_count?: number;
  active_campaigns_count?: number;
  total_funds_raised?: number;
  currency?: import("@/features/shared/types").Currency;
  settings_override?: Record<string, unknown> | null;
}

export interface GroupCardProps {
  group: GroupInfo;
  className?: string;
  variant?: "table" | "grid" | "stack";
  onViewDetails?: () => void;
  onToggleFavorite?: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  className,
  variant = "grid",
  onViewDetails,
  onToggleFavorite,
}) => {
  const campaigns = group.campaigns ?? [];
  const isArchived = group.status === "Archived";

  const primaryColor = group.settings_override?.primary_color as string | undefined;
  const cardColor = group.settings_override?.card_color as string | undefined;
  const tagline = group.settings_override?.tagline as string | undefined;
  const avatarStyle = primaryColor
    ? { backgroundColor: `${primaryColor}15`, color: primaryColor }
    : undefined;
  const badgeStyle = primaryColor
    ? { backgroundColor: `${primaryColor}15`, color: primaryColor }
    : undefined;
  const dotStyle = primaryColor ? { backgroundColor: primaryColor } : undefined;
  const cardStyle = cardColor ? { backgroundColor: cardColor } : undefined;

  const coverPhotoRaw = group.settings_override?.cover_photo as string | undefined;
  const fullCoverPhotoUrl = coverPhotoRaw
    ? coverPhotoRaw.startsWith("http")
      ? coverPhotoRaw
      : `/api${coverPhotoRaw}`
    : null;

  if (variant === "table") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-4 px-4 py-3 bg-card hover:bg-muted/50 border-b border-border last:border-b-0 transition-colors group",
          className,
        )}
        style={cardStyle}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFavorite}
            className="w-8 h-8 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <IconLibrary
              name="favorite"
              className={cn(
                "w-4 h-4 transition-colors",
                group.isFavorite ? "text-destructive fill-destructive" : "",
              )}
            />
          </Button>
          {fullCoverPhotoUrl ? (
            <img
              src={fullCoverPhotoUrl}
              alt={group.name}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                !primaryColor && (group.iconClassName ?? "bg-primary/15 text-primary"),
              )}
              style={avatarStyle}
            >
              {getInitials(group.name)}
            </div>
          )}
          <div className="flex flex-col min-w-0 pr-4 w-1/4 shrink-0">
            <h3 className="text-sm font-semibold truncate text-foreground leading-tight">
              {group.name}
            </h3>
            {tagline ? (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{tagline}</p>
            ) : (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{group.description}</p>
            )}
          </div>

          <div className="hidden md:flex w-1/4 items-center text-xs text-muted-foreground gap-2 truncate">
            <IconLibrary name="campaign" className="w-4 h-4 text-muted-foreground/60" />
            {group.active_campaigns_count} Active Campaigns
          </div>
          <div className="hidden lg:flex w-1/4 items-center text-xs font-semibold text-foreground gap-2 truncate">
            {group.currency} {group.total_funds_raised?.toLocaleString()}
          </div>

          <div className="w-24 shrink-0 hidden sm:block">
            {group.status && (
              <Badge
                variant="secondary"
                className={cn(
                  "font-semibold px-2 py-0.5 text-[10px] gap-1.5 border-none shadow-none",
                  isArchived
                    ? "bg-muted text-muted-foreground"
                    : !primaryColor &&
                        "bg-primary/15 text-primary dark:bg-primary/20 dark:text-primary",
                )}
                style={!isArchived ? badgeStyle : undefined}
              >
                <span
                  className={cn(
                    "w-1 h-1 rounded-full shrink-0",
                    isArchived
                      ? "bg-muted-foreground"
                      : !primaryColor && "bg-primary dark:bg-primary",
                  )}
                  style={!isArchived ? dotStyle : undefined}
                />
                {group.status}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/treasurer/groups/${group.slug || group.id}/settings`}>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              title="Group Settings"
            >
              <IconLibrary name="settings" className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/treasurer/groups/${group.slug || group.id}`}>
            <Button
              size="sm"
              onClick={onViewDetails}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 h-8 text-xs font-medium"
            >
              View Group
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("bg-card flex flex-col h-full", className)} style={cardStyle}>
      <div className="flex flex-col gap-6 flex-1">
        {/* Header */}
        <div className="flex flex-row items-start gap-4">
          {fullCoverPhotoUrl ? (
            <img
              src={fullCoverPhotoUrl}
              alt={group.name}
              className="w-14 h-14 rounded-full object-cover shrink-0 mt-0.5"
            />
          ) : (
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0 mt-0.5",
                !primaryColor && (group.iconClassName ?? "bg-primary/15 text-primary"),
              )}
              style={avatarStyle}
            >
              {getInitials(group.name)}
            </div>
          )}
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold tracking-tight text-foreground leading-tight truncate">
                {group.name}
              </h3>
              {group.status && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "font-semibold px-3 py-1 text-xs gap-1.5 border-none shadow-none shrink-0",
                    isArchived
                      ? "bg-muted text-muted-foreground"
                      : !primaryColor &&
                          "bg-primary/15 text-primary dark:bg-primary/20 dark:text-primary",
                  )}
                  style={!isArchived ? badgeStyle : undefined}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      isArchived
                        ? "bg-muted-foreground"
                        : !primaryColor && "bg-primary dark:bg-primary",
                    )}
                    style={!isArchived ? dotStyle : undefined}
                  />
                  {group.status}
                </Badge>
              )}
            </div>
            {tagline && <p className="text-sm font-medium text-foreground/80 mt-0.5">{tagline}</p>}
            <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
          </div>
        </div>

        {/* Campaigns Progress */}
        {campaigns.length > 0 && (
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4">
              {campaigns.map((c) => (
                <div key={c.name} className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-foreground truncate flex-1">{c.name}</span>
                  <div className="flex items-center gap-3 shrink-0 w-32 sm:w-40">
                    <Progress
                      value={c.progress}
                      className="w-full **:data-[slot=progress-track]:h-1.5"
                    />
                    <span className="text-xs font-bold text-primary tabular-nums leading-none min-w-[3ch] text-right">
                      {c.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </div>

      {/* Footer Actions */}
      <CardFooter className="flex flex-row items-center justify-between gap-2 border-none bg-transparent mt-auto">
        <Link href={`/treasurer/groups/${group.slug || group.id}`}>
          <Button
            onClick={onViewDetails}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4"
          >
            View Details
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/treasurer/groups/${group.slug || group.id}/settings`}>
            <Button
              variant="outline"
              className="border-primary text-primary hover:text-primary hover:bg-primary/5"
            >
              Group Settings
            </Button>
          </Link>
          <Button variant="outline" size="icon" onClick={onToggleFavorite}>
            <IconLibrary
              name="favorite"
              className={cn(
                "w-5 h-5",
                group.isFavorite ? "text-destructive fill-destructive" : "text-muted-foreground",
              )}
            />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GroupCard;
