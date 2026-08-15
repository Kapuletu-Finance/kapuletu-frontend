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
import { useCampaignsQuery } from "@/features/campaigns/services/queries";

interface CampaignSelectProps {
  groupId?: string;
  value?: string;
  onChange: (value: string, slug?: string) => void;
  disabled?: boolean;
  error?: string;
}

export function CampaignSelect({ groupId, value, onChange, disabled, error }: CampaignSelectProps) {
  const [search, setSearch] = useState("");
  // Only query campaigns if groupId is provided
  const { data, isLoading } = useCampaignsQuery(groupId || "", { search, limit: 20 });
  const isDisabled = disabled || !groupId;
  const [selectedName, setSelectedName] = useState<string>("");

  useEffect(() => {
    if (value && data?.items) {
      const found = data.items.find((c) => c.id === value);
      if (found) setSelectedName(found.title);
    }
  }, [value, data?.items]);

  return (
    <div className="flex flex-col gap-1.5">
      <Select
        value={value}
        onValueChange={(val) => {
          if (val) {
            const campaign = data?.items?.find((c) => c.id === val);
            onChange(val, campaign?.slug || undefined);
          }
        }}
        disabled={isDisabled}
      >
        <SelectTrigger className="w-full" aria-invalid={!!error}>
          <SelectValue placeholder={!groupId ? "Select a group first" : "Select a campaign"}>
            {selectedName || undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <div className="p-2 sticky top-0 bg-popover z-10 border-b border-border mb-1">
            <Input
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : data?.items.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No campaigns found</div>
          ) : (
            data?.items.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                {campaign.title}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}
