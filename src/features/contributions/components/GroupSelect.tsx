"use client";

import { useEffect, useState } from "react";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGroupsQuery } from "@/features/groups/services/queries";

interface GroupSelectProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export function GroupSelect({ value, onChange, disabled, error }: GroupSelectProps) {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGroupsQuery({ search, limit: 20 });
  const [selectedName, setSelectedName] = useState<string>("");

  useEffect(() => {
    if (value && data?.items) {
      const found = data.items.find((g) => g.id === value);
      if (found) setSelectedName(found.name);
    }
  }, [value, data?.items]);

  return (
    <div className="flex flex-col gap-1.5">
      <Select
        value={value}
        onValueChange={(val) => {
          if (val) onChange(val);
        }}
        disabled={disabled}
      >
        <SelectTrigger className="w-full" aria-invalid={!!error}>
          <SelectValue placeholder="Select a group">{selectedName || undefined}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <div className="p-2 sticky top-0 bg-popover z-10 border-b border-border mb-1">
            <Input
              placeholder="Search groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : data?.items.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No groups found</div>
          ) : (
            data?.items.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}
