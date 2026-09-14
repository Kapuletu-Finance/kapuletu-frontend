import Link from "next/link";
import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import EditGroupDialogForm from "@/features/groups/components/EditGroupDialogForm";
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

  if (variant === "table") {
    return (
      <Card
        className={cn(
          "bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
          className,
        )}
      >
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
              group.iconClassName ?? "bg-primary/15 text-primary",
            )}
          >
            {getInitials(group.name)}
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-bold tracking-tight text-foreground leading-tight">
              {group.name}
            </h3>
            <p className="text-xs text-muted-foreground">{group.description}</p>
          </div>
          {group.status && (
            <Badge
              variant="secondary"
              className={cn(
                "ml-4 font-semibold px-2.5 py-0.5 text-[10px] gap-1.5 border-none shadow-none hidden sm:inline-flex",
                isArchived
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/15 text-primary dark:bg-primary/20 dark:text-primary",
              )}
            >
              <span
                className={cn(
                  "w-1 h-1 rounded-full shrink-0",
                  isArchived ? "bg-muted-foreground" : "bg-primary dark:bg-primary",
                )}
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
          <EditGroupDialogForm group={group}>
            <Button
              size="sm"
              variant="outline"
              className="border-primary text-primary hover:text-primary hover:bg-primary/5 h-9"
            >
              Edit Group
            </Button>
          </EditGroupDialogForm>
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
    <Card className={cn("bg-card flex flex-col h-full", className)}>
      <div className="flex flex-col gap-6 flex-1">
        {/* Header */}
        <div className="flex flex-row items-start gap-4">
          <div
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0 mt-0.5",
              group.iconClassName ?? "bg-primary/15 text-primary",
            )}
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
                      : "bg-primary/15 text-primary dark:bg-primary/20 dark:text-primary",
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      isArchived ? "bg-muted-foreground" : "bg-primary dark:bg-primary",
                    )}
                  />
                  {group.status}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{group.description}</p>
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
          <EditGroupDialogForm group={group}>
            <Button
              variant="outline"
              className="border-primary text-primary hover:text-primary hover:bg-primary/5"
            >
              Edit Group
            </Button>
          </EditGroupDialogForm>
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
