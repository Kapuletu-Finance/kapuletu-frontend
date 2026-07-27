"use client";

import { parseAsString, useQueryState } from "nuqs";
import type * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IconLibrary from "@/features/shared/components/IconLibrary";

const filterOptions = [
  { label: "All Groups", value: "all" },
  { label: "Active Groups", value: "active" },
  { label: "Archived Groups", value: "archived" },
] as const;

export type FilterValue = (typeof filterOptions)[number]["value"];

export interface GroupsHeaderControlsProps {
  onSearchChange?: (search: string) => void;
  onFilterChange?: (filter: FilterValue) => void;
  searchValue?: string;
  filterValue?: FilterValue;
}

const GroupsHeaderControls: React.FC<GroupsHeaderControlsProps> = ({
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
          placeholder="Search group..."
          className="w-full bg-background pl-10 pr-4 h-10"
          value={searchValue ?? ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <Select value={selectedFilter} onValueChange={(v) => handleSelectFilter(v as FilterValue)}>
          <SelectTrigger className="h-10 w-40 bg-background text-sm font-semibold text-foreground">
            <SelectValue>
              {filterOptions.find((o) => o.value === selectedFilter)?.label ?? "All Groups"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

export default GroupsHeaderControls;
