"use client";

import type * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateGroupDialogForm from "@/features/groups/components/CreateGroupButtonDialogForm";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn } from "@/lib/utils";

const filterOptions = [
  "All Groups",
  "Favorite Groups",
  "Active Groups",
  "Completed Groups",
  "Archived Groups",
] as const;

export type FilterOption = (typeof filterOptions)[number];

export interface GroupsHeaderControlsProps {
  onFilterChange?: (filter: FilterOption) => void;
}

const GroupsHeaderControls: React.FC<GroupsHeaderControlsProps> = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("All Groups");

  const handleSelectFilter = (option: FilterOption) => {
    setSelectedFilter(option);
    onFilterChange?.(option);
  };

  return (
    <div className="flex items-center gap-3 sm:gap-6">
      <div className="flex items-center gap-0 sm:gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                className="flex h-10 cursor-pointer items-center gap-1 px-2 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary sm:gap-1.5 sm:px-2.5 sm:text-base"
              />
            }
          >
            <span>{selectedFilter}</span>
            <IconLibrary name="chevron-down" className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-2xl border border-border bg-popover p-2 shadow-xl"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Group Filters
              </DropdownMenuLabel>
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => handleSelectFilter(option)}
                  className={cn(
                    "cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    selectedFilter === option
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Filter groups"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground hover:bg-muted sm:h-10 sm:w-10"
              />
            }
          >
            <IconLibrary name="filter" className="h-4 w-4 sm:h-5 sm:w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-2xl border border-border bg-popover p-2 shadow-xl"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Group Filters
              </DropdownMenuLabel>
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => handleSelectFilter(option)}
                  className={cn(
                    "cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    selectedFilter === option
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CreateGroupDialogForm />
    </div>
  );
};

export default GroupsHeaderControls;
