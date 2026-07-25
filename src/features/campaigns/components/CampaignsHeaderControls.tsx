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
  { label: "All Campaigns", value: "all" },
  { label: "Active Campaigns", value: "active" },
  { label: "Archived Campaigns", value: "archived" },
] as const;

export type FilterValue = (typeof filterOptions)[number]["value"];

export interface CampaignsHeaderControlsProps {
  onSearchChange?: (search: string) => void;
  onFilterChange?: (filter: FilterValue) => void;
  searchValue?: string;
  filterValue?: FilterValue;
}

const CampaignsHeaderControls: React.FC<CampaignsHeaderControlsProps> = ({
  onSearchChange,
  onFilterChange,
  searchValue,
  filterValue,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterValue>(filterValue ?? "all");
  const [view, setView] = useQueryState("view", parseAsString.withDefault("grid"));

  const handleSelectFilter = (value: FilterValue) => {
    setSelectedFilter(value);
    onFilterChange?.(value);
  };

  const selectedLabel =
    filterOptions.find((o) => o.value === selectedFilter)?.label ?? "All Campaigns";

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
          value={searchValue ?? ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="flex h-10 cursor-pointer items-center gap-2 px-4 text-sm font-semibold text-foreground bg-background"
              />
            }
          >
            <span>{selectedLabel}</span>
            <IconLibrary name="chevron-down" className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 border border-border bg-popover p-2 shadow-xl"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Campaign Filters
              </DropdownMenuLabel>
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSelectFilter(option.value)}
                  className={cn(
                    "cursor-pointer px-3 py-2.5 text-sm font-medium transition-colors",
                    selectedFilter === option.value
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
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
