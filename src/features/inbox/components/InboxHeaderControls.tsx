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

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "All Statuses", value: "all" },
] as const;

export type StatusFilterValue = (typeof statusOptions)[number]["value"];

const sortOptions = [
  { label: "Newest First", value: "date-desc" },
  { label: "Oldest First", value: "date-asc" },
  { label: "Amount: High to Low", value: "amount-desc" },
  { label: "Amount: Low to High", value: "amount-asc" },
] as const;

export type SortFilterValue = (typeof sortOptions)[number]["value"];

export interface InboxHeaderControlsProps {
  onSearchChange?: (search: string) => void;
  onFilterChange?: (filter: TimeFilterValue) => void;
  onStatusChange?: (status: StatusFilterValue) => void;
  onSortChange?: (sort: SortFilterValue) => void;
  searchValue?: string;
  filterValue?: TimeFilterValue;
  statusValue?: string;
  sortValue?: string;
}

const InboxHeaderControls: React.FC<InboxHeaderControlsProps> = ({
  onSearchChange,
  onFilterChange,
  onStatusChange,
  onSortChange,
  searchValue,
  filterValue,
  statusValue,
  sortValue,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<TimeFilterValue>(filterValue ?? "this_year");
  const [selectedStatus, setSelectedStatus] = useState<string>(statusValue ?? "pending");
  const [selectedSort, setSelectedSort] = useState<string>(sortValue ?? "date-desc");

  const handleSelectFilter = (value: TimeFilterValue) => {
    setSelectedFilter(value);
    onFilterChange?.(value);
  };

  const handleSelectStatus = (value: StatusFilterValue) => {
    setSelectedStatus(value);
    onStatusChange?.(value);
  };

  const handleSelectSort = (value: SortFilterValue) => {
    setSelectedSort(value);
    onSortChange?.(value);
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
          placeholder="Search contribution..."
          className="w-full bg-background pl-10 pr-4 h-10 border-border"
          value={searchValue ?? ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Status Filter */}
        <Select
          value={selectedStatus}
          onValueChange={(v) => handleSelectStatus(v as StatusFilterValue)}
        >
          <SelectTrigger className="h-10 w-40 bg-background text-sm font-semibold text-foreground">
            <div className="flex items-center gap-2">
              <IconLibrary name="filter" className="h-4 w-4" />
              <SelectValue>
                {statusOptions.find((o) => o.value === selectedStatus)?.label ?? "Pending"}
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent align="end">
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Filter */}
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

        {/* Sort Filter */}
        <Select value={selectedSort} onValueChange={(v) => handleSelectSort(v as SortFilterValue)}>
          <SelectTrigger className="h-10 w-44 bg-background text-sm font-semibold text-foreground">
            <div className="flex items-center gap-2">
              <IconLibrary name="filter" className="h-4 w-4" />
              <SelectValue>
                {sortOptions.find((o) => o.value === selectedSort)?.label ?? "Newest First"}
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent align="end">
            {sortOptions.map((option) => (
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
