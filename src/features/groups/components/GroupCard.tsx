import { Heart } from "lucide-react";
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
import { cn } from "@/lib/utils";

export interface CampaignProgress {
  name: string;
  progress: number;
}

export interface GroupInfo {
  id?: string;
  name: string;
  description: string;
  icon?: string | React.ReactNode;
  iconClassName?: string;
  status?: string;
  isFavorite?: boolean;
  campaigns?: CampaignProgress[];
}

export interface GroupCardProps {
  group: GroupInfo;
  className?: string;
  onViewDetails?: () => void;
  onManageGroup?: () => void;
  onToggleFavorite?: () => void;
  onViewAllCampaigns?: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  className,
  onViewDetails,
  onManageGroup,
  onToggleFavorite,
  onViewAllCampaigns,
}) => {
  const campaigns = group.campaigns ?? [];
  const isArchived = group.status === "Archived";

  return (
    <Card
      className={cn(
        "rounded-3xl border-none shadow-sm p-6 space-y-6 bg-card flex flex-col justify-between",
        className,
      )}
    >
      <div className="space-y-6">
        {/* Header */}
        <CardHeader className="p-0 flex-row items-center gap-4 space-y-0">
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center text-2xl shrink-0",
              group.iconClassName ?? "bg-primary/15 text-primary",
            )}
          >
            {group.icon ?? "🤲"}
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
                  <div className="flex flex-col items-end gap-1.5 shrink-0 w-28 sm:w-36">
                    <span className="text-xs font-bold text-primary tabular-nums leading-none">
                      {c.progress}%
                    </span>
                    <Progress
                      value={c.progress}
                      className="w-full **:data-[slot=progress-track]:h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-1">
              <Button
                variant="link"
                onClick={onViewAllCampaigns}
                className="p-0 h-auto font-semibold text-primary text-sm hover:underline"
              >
                View All
              </Button>
            </div>
          </CardContent>
        )}
      </div>

      {/* Footer Actions */}
      <CardFooter className="flex flex-row items-center gap-2 border-none bg-transparent">
        <Button variant="outline" onClick={onManageGroup}>
          Manage Group
        </Button>
        <Button onClick={onViewDetails}>View Details</Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleFavorite}
          className="rounded-full border border-border h-11 w-11 shrink-0 flex items-center justify-center"
        >
          <Heart
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
