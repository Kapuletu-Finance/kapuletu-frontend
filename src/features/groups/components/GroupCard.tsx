import Link from "next/link";
import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ManageGroupDialogForm from "@/features/groups/components/ManageGroupDialogForm";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn, getInitials } from "@/lib/utils";

export interface CampaignProgress {
  name: string;
  progress: number;
}

export interface GroupInfo {
  id: string;
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
  variant?: "grid" | "list";
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

  if (variant === "list") {
    return (
      <Card
        className={cn(
          "p-4 bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
          className,
        )}
      >
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div
            className={cn(
              "w-12 h-12 rounded-md flex items-center justify-center text-sm font-bold shrink-0",
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
                "ml-4 font-semibold rounded-full px-2.5 py-0.5 text-[10px] gap-1.5 border-none shadow-none hidden sm:inline-flex",
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
              {group.status}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Link href={`/treasurer/groups/${group.id}`}>
            <Button
              size="sm"
              onClick={onViewDetails}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 h-9"
            >
              View Details
            </Button>
          </Link>
          <ManageGroupDialogForm group={group}>
            <Button
              size="sm"
              variant="outline"
              className="border-primary text-primary hover:text-primary hover:bg-primary/5 h-9"
            >
              Manage Group
            </Button>
          </ManageGroupDialogForm>
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleFavorite}
            className="rounded-md border border-border h-9 w-9 shrink-0 flex items-center justify-center"
          >
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
    <Card className={cn("p-6 space-y-6 bg-card flex flex-col justify-between", className)}>
      <div className="space-y-6">
        {/* Header */}
        <CardHeader className="p-0 flex-row items-center gap-4 space-y-0">
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0",
              group.iconClassName ?? "bg-primary/15 text-primary",
            )}
          >
            {getInitials(group.name)}
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">
              {group.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {group.description}
            </CardDescription>
          </div>
          {group.status && (
            <CardAction className="ml-auto self-start sm:self-center">
              <Badge
                variant="secondary"
                className={cn(
                  "font-semibold rounded-full px-3 py-1 text-xs gap-1.5 border-none shadow-none",
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
                {group.status}
              </Badge>
            </CardAction>
          )}
        </CardHeader>

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
      <CardFooter className="flex flex-row flex-wrap items-center gap-2 border-none bg-transparent px-0 pb-6 pt-0">
        <Link href={`/treasurer/groups/${group.id}`}>
          <Button
            onClick={onViewDetails}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
          >
            View Details
          </Button>
        </Link>
        <ManageGroupDialogForm group={group}>
          <Button
            variant="outline"
            className="border-primary text-primary hover:text-primary hover:bg-primary/5"
          >
            Manage Group
          </Button>
        </ManageGroupDialogForm>
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleFavorite}
          className="rounded-md border border-border h-10 w-10 shrink-0 flex items-center justify-center"
        >
          <IconLibrary
            name="favorite"
            className={cn(
              "w-5 h-5",
              group.isFavorite ? "text-destructive fill-destructive" : "text-muted-foreground",
            )}
          />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GroupCard;
