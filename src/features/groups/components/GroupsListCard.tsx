"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGroupsQuery } from "@/features/groups/services/queries";
import EmptyState from "@/features/shared/components/EmptyState";
import { getAvatarColor } from "@/lib/colors";
import { getInitials } from "@/lib/utils";

const GroupsListCard = () => {
  const { data, isLoading } = useGroupsQuery({ limit: 5 });

  if (isLoading) {
    return (
      <Card className="shadow-sm p-6 flex-1 flex flex-col">
        <div className="flex flex-col gap-4">
          {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((key) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 py-4 border-b border-border"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full flex items-center justify-center bg-muted text-muted-foreground font-semibold text-sm">
                  --
                </div>
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-48 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const groups = data?.items ?? [];

  return (
    <Card className="shadow-sm p-6 flex-1 flex flex-col">
      <div className="flex flex-col">
        {groups.map((group) => (
          <Link
            key={group.id}
            href={`/treasurer/groups/${group.id}`}
            className="flex items-center justify-between gap-4 py-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors rounded-lg -mx-2 px-2"
          >
            <div className="flex items-center gap-4">
              <div
                className={`size-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(group.name)}`}
              >
                {getInitials(group.name)}
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-semibold text-sm sm:text-base">
                  {group.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {group.description || "No description"}
                </span>
              </div>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              <span className="font-semibold text-foreground">{group.total_campaigns_count}</span>{" "}
              campaigns
            </span>
          </Link>
        ))}
        {groups.length === 0 && (
          <div className="py-4">
            <EmptyState message="No groups yet." />
          </div>
        )}
      </div>
    </Card>
  );
};

export default GroupsListCard;
