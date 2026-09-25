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

  if (variant === "table") {
    return (
      <Card
        className={cn(
          "bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
          className,
        )}
        style={cardStyle}
      >
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
              !primaryColor && (group.iconClassName ?? "bg-primary/15 text-primary"),
            )}
            style={avatarStyle}
          >
            {getInitials(group.name)}
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-bold tracking-tight text-foreground leading-tight">
              {group.name}
            </h3>
            {tagline && <p className="text-xs font-medium text-foreground/80 mt-0.5">{tagline}</p>}
            <p className="text-xs text-muted-foreground line-clamp-1">{group.description}</p>
          </div>
          {group.status && (
            <Badge
              variant="secondary"
              className={cn(
                "ml-4 font-semibold px-2.5 py-0.5 text-[10px] gap-1.5 border-none shadow-none hidden sm:inline-flex",
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

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Link href={`/treasurer/groups/${group.slug || group.id}`}>
            <Button
              size="sm"
              onClick={onViewDetails}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 h-9"
            >
              View Details
            </Button>
          </Link>
          <Link href={`/treasurer/groups/${group.slug || group.id}/settings`}>
            <Button
              size="sm"
              variant="outline"
              className="border-primary text-primary hover:text-primary hover:bg-primary/5 h-9"
            >
              Group Settings
            </Button>
          </Link>
          <Button variant="outline" size="icon" onClick={onToggleFavorite}>
            <IconLibrary
              name="favorite"
              className={cn(
                "w-4 h-4",
                group.isFavorite ? "text-destructive fill-destructive" : "text-muted-foreground",
              )}
            />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-card flex flex-col h-full", className)} style={cardStyle}>
      <div className="flex flex-col gap-6 flex-1">
        {/* Header */}
        <div className="flex flex-row items-start gap-4">
          <div
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0 mt-0.5",
              !primaryColor && (group.iconClassName ?? "bg-primary/15 text-primary"),
            )}
            style={avatarStyle}
          >
            {getInitials(group.name)}
          </div>
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
