"use client";

import { parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import GroupCard, { type GroupInfo } from "@/features/groups/components/GroupCard";
import GroupsHeaderControls from "@/features/groups/components/GroupsHeaderControls";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn } from "@/lib/utils";

interface TreasurerGroupsPageClientProps {
  groups: GroupInfo[];
}

export const TreasurerGroupsPageClient = ({ groups }: TreasurerGroupsPageClientProps) => {
  const [view] = useQueryState("view", parseAsString.withDefault("grid"));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <GroupsHeaderControls />
      </div>

      <div
        className={cn(
          view === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            : "flex flex-col gap-4",
        )}
      >
        {groups.map((group) => (
          <GroupCard key={group.id ?? group.name} group={group} variant={view as "grid" | "list"} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-2 pt-6 pb-12">
        <Button variant="outline" size="icon" className="rounded-full text-muted-foreground">
          <IconLibrary name="chevron-left" className="w-4 h-4" />
        </Button>
        <Button size="icon" className="rounded-full font-semibold shadow-sm">
          1
        </Button>
        <Button variant="outline" size="icon" className="rounded-full text-foreground font-medium">
          2
        </Button>
        <Button variant="outline" size="icon" className="rounded-full text-foreground font-medium">
          3
        </Button>
        <Button variant="outline" size="icon" className="rounded-full text-muted-foreground">
          <IconLibrary name="chevron-right" className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
