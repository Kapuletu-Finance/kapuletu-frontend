"use client";

import type * as React from "react";
import { useState } from "react";
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
  { label: "All time", value: "all" },
  { label: "This year", value: "this_year" },
  { label: "This month", value: "this_month" },
  { label: "This week", value: "this_week" },
] as const;

export type TimeFilterValue = (typeof filterOptions)[number]["value"];

export interface InboxHeaderControlsProps {
  onSearchChange?: (search: string) => void;
  onFilterChange?: (filter: TimeFilterValue) => void;
  searchValue?: string;
  filterValue?: TimeFilterValue;
}

const InboxHeaderControls: React.FC<InboxHeaderControlsProps> = ({
  onSearchChange,
  onFilterChange,
  searchValue,
  filterValue,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<TimeFilterValue>(filterValue ?? "this_year");

  const handleSelectFilter = (value: TimeFilterValue) => {
    setSelectedFilter(value);
    onFilterChange?.(value);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center w-full justify-between gap-4">
      {/* Search Bar */}
      <div className="relative w-full flex-1 max-w-lg">
        <IconLibrary
          name="search"
          className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10"
        />
        <Input
          type="search"
          placeholder="Search contribution..."
          className="w-full bg-background pl-10 pr-4 h-10 border-border"
          value={searchValue ?? ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      {/* Date Filter */}
      <div className="flex items-center shrink-0">
        <Select
          value={selectedFilter}
          onValueChange={(v) => handleSelectFilter(v as TimeFilterValue)}
        >
          <SelectTrigger className="h-10 w-40 bg-background text-sm font-semibold text-foreground">
            <div className="flex items-center gap-2">
              <IconLibrary name="calendar" className="h-4 w-4" />
              <SelectValue>
                {filterOptions.find((o) => o.value === selectedFilter)?.label ?? "This year"}
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent align="end">
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default InboxHeaderControls;
