"use client";

import { parseAsString, useQueryState } from "nuqs";
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
import { Input } from "@/components/ui/input";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn } from "@/lib/utils";

const filterOptions = [
  "All Campaigns",
  "Favorite Campaigns",
  "Active Campaigns",
  "Completed Campaigns",
  "Archived Campaigns",
] as const;

export type FilterOption = (typeof filterOptions)[number];

export interface CampaignsHeaderControlsProps {
  onFilterChange?: (filter: FilterOption) => void;
}

const CampaignsHeaderControls: React.FC<CampaignsHeaderControlsProps> = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("All Campaigns");
  const [view, setView] = useQueryState("view", parseAsString.withDefault("grid"));

  const handleSelectFilter = (option: FilterOption) => {
    setSelectedFilter(option);
    onFilterChange?.(option);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center w-full justify-between gap-4">
      {/* Search Bar */}
      <div className="relative w-full flex-1">
        <IconLibrary
          name="search"
          className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10"
        />
        <Input
          type="search"
          placeholder="Search campaign..."
          className="w-full bg-background pl-10 pr-4 h-10"
        />
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="flex h-10 cursor-pointer items-center gap-2 px-4 rounded-xl text-sm font-semibold text-foreground bg-background"
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
                Campaign Filters
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
                variant="outline"
                className="flex h-10 cursor-pointer items-center gap-2 px-4 rounded-xl text-sm font-semibold text-foreground bg-background"
              />
            }
          >
            <IconLibrary name="calendar" className="h-4 w-4 text-muted-foreground" />
            <span>This year</span>
            <IconLibrary name="chevron-down" className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 rounded-2xl border border-border bg-popover p-2 shadow-xl"
          >
            <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted">
              This year
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted">
              Last year
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setView(view === "grid" ? "list" : "grid")}
          className="h-10 w-10 text-muted-foreground hover:text-foreground shrink-0"
        >
          <IconLibrary name={view === "grid" ? "menu" : "dashboard"} className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CampaignsHeaderControls;
